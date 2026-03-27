# Generado por /dc:specify
# Revisado por /dc:clarify — ambigüedades resueltas el 2026-03-10

Feature: Autenticación JWT
  Como usuario de la plataforma
  Quiero registrarme y autenticarme con credenciales
  Para acceder de forma segura a los recursos protegidos

  Background:
    Given la API está disponible en "/api/v1"
    And la base de datos está limpia

  # ── REGISTRO ──────────────────────────────────────────────────────────────

  @P1 @registro
  Scenario: Registro exitoso de un usuario nuevo
    Given no existe ningún usuario con el email "ana@example.com"
    When envío POST "/auth/register" con:
      | campo    | valor            |
      | name     | Ana García       |
      | email    | ana@example.com  |
      | password | SecurePass123!   |
    Then el código de respuesta es 201
    And el cuerpo contiene "token" con un JWT válido
    And el cuerpo contiene "user.id" con un UUID
    And el cuerpo NO contiene "password"

  # ── LOGIN ─────────────────────────────────────────────────────────────────

  @P1 @login
  Scenario: Login exitoso con credenciales correctas
    Given existe un usuario registrado con email "ana@example.com" y password "SecurePass123!"
    When envío POST "/auth/login" con:
      | campo    | valor           |
      | email    | ana@example.com |
      | password | SecurePass123!  |
    Then el código de respuesta es 200
    And el cuerpo contiene "token" con un JWT válido
    And el token expira en 24 horas

  @P1 @login @sad-path
  Scenario: Login rechazado con credenciales inválidas
    Given existe un usuario registrado con email "ana@example.com"
    When envío POST "/auth/login" con:
      | campo    | valor           |
      | email    | ana@example.com |
      | password | WrongPassword!  |
    Then el código de respuesta es 401
    And el cuerpo contiene "error" con "Credenciales inválidas"
    And el cuerpo NO contiene "token"

  # ── RUTAS PROTEGIDAS ──────────────────────────────────────────────────────

  @P1 @protegida
  Scenario: Acceso a ruta protegida con token válido
    Given existe un usuario registrado con email "ana@example.com"
    And tengo un token JWT válido para "ana@example.com"
    When envío GET "/auth/me" con header "Authorization: Bearer <token>"
    Then el código de respuesta es 200
    And el cuerpo contiene "user.email" con "ana@example.com"
    And el cuerpo NO contiene "password"

  @P1 @protegida @sad-path
  Scenario: Acceso denegado a ruta protegida sin token
    When envío GET "/auth/me" sin header de autorización
    Then el código de respuesta es 401
    And el cuerpo contiene "error" con "Token requerido"

  # ── EDGE CASES ────────────────────────────────────────────────────────────

  @P2 @protegida @edge-case
  Scenario: Acceso denegado con token expirado
    Given existe un usuario registrado con email "ana@example.com"
    And tengo un token JWT que expiró hace 1 hora para "ana@example.com"
    When envío GET "/auth/me" con header "Authorization: Bearer <token_expirado>"
    Then el código de respuesta es 401
    And el cuerpo contiene "error" con "Token expirado"
