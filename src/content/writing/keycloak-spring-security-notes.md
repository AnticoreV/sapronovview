---
title: "Notes on integrating Keycloak with Spring Security"
description: "Practical notes from wiring OAuth 2.0 and OpenID Connect into Spring Boot services with Keycloak: resource servers, role mapping and the mistakes worth avoiding."
pubDate: 2026-07-14
tags: ["java", "spring", "keycloak", "security"]
featured: true
draft: false
placeholder: true
---

> **Sample article.** Written as an example of a technical post. Replace it with your own notes — the topic reflects real experience from your CV, but the details below are generic.

Most Spring applications I have worked on eventually need proper identity: single sign-on, roles that mean something, tokens that expire. Keycloak is a reasonable default, and Spring Security speaks OAuth 2.0 natively. The integration is simple once you know which half of Spring Security you are actually using.

## Resource server, not client

A backend API is a **resource server**: it validates bearer tokens, it does not perform the login redirect. That distinction removes most of the configuration:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://sso.example.com/realms/main
```

Spring fetches the realm's JWKS on start-up and validates signatures locally, so there is no network call per request.

## Mapping realm roles to authorities

Keycloak puts realm roles under `realm_access.roles`, which Spring does not read by default. A small converter fixes that:

```java
@Bean
JwtAuthenticationConverter jwtAuthenticationConverter() {
  var converter = new JwtAuthenticationConverter();
  converter.setJwtGrantedAuthoritiesConverter(jwt -> {
    var realm = jwt.getClaimAsMap("realm_access");
    var roles = (Collection<String>) realm.getOrDefault("roles", List.of());
    return roles.stream()
      .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
      .collect(toList());
  });
  return converter;
}
```

## Things that bit me

- **Clock skew.** Containers with drifting clocks reject perfectly valid tokens. Allow a minute of skew.
- **Audience.** Keycloak does not set `aud` to your API by default; add an audience mapper or validate `azp`.
- **Local development.** Run Keycloak in Docker Compose with a realm export checked into the repo, so a new developer gets working SSO with one command.

## Summary

Treat the API as a resource server, map roles explicitly, and keep the realm configuration in version control. Everything else is details.
