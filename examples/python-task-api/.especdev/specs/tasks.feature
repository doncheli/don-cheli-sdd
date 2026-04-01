# language: es
@lista
Característica: API de Tareas
  Como usuario de la API
  Quiero gestionar mis tareas
  Para organizar mi trabajo diario

  Antecedentes:
    Dado que la API está corriendo en el puerto 8000
    Y que tengo un API key válido "test-key-123"

  @P1
  Escenario: Crear tarea exitosamente
    Cuando envío POST /tasks con header "X-API-Key: test-key-123" y body:
      | campo       | valor                    |
      | title       | Completar documentación  |
      | description | Escribir README del API  |
    Entonces recibo status 201
    Y la respuesta contiene "id" como UUID
    Y la respuesta contiene "status" con valor "pending"
    Y la respuesta contiene "created_at" como ISO 8601

  @P1
  Escenario: Listar tareas con filtro por estado
    Dado que existen 3 tareas con estado "pending"
    Y 2 tareas con estado "done"
    Cuando envío GET /tasks?status=pending con header "X-API-Key: test-key-123"
    Entonces recibo status 200
    Y la respuesta contiene exactamente 3 tareas
    Y todas las tareas tienen "status" con valor "pending"

  @P1
  Escenario: Actualizar estado de tarea
    Dado que existe una tarea con id "task-uuid-1" y estado "pending"
    Cuando envío PATCH /tasks/task-uuid-1 con header "X-API-Key: test-key-123" y body:
      | campo  | valor       |
      | status | in_progress |
    Entonces recibo status 200
    Y la respuesta contiene "status" con valor "in_progress"

  @P1
  Escenario: Eliminar tarea exitosamente
    Dado que existe una tarea con id "task-uuid-1"
    Cuando envío DELETE /tasks/task-uuid-1 con header "X-API-Key: test-key-123"
    Entonces recibo status 204

  @P1
  Escenario: Rechazar acceso sin API key
    Cuando envío GET /tasks sin header de autenticación
    Entonces recibo status 401
    Y la respuesta contiene "error" con valor "API key required"

  @P2
  Escenario: Rechazar API key inválido
    Cuando envío GET /tasks con header "X-API-Key: invalid-key"
    Entonces recibo status 403
    Y la respuesta contiene "error" con valor "Invalid API key"

  @P2
  Escenario: Validar estados permitidos
    Dado que existe una tarea con id "task-uuid-1"
    Cuando envío PATCH /tasks/task-uuid-1 con body:
      | campo  | valor   |
      | status | deleted |
    Entonces recibo status 422
    Y la respuesta contiene "error" con mensaje sobre estados válidos

  @P3
  Escenario: Tarea no encontrada retorna 404
    Cuando envío GET /tasks/uuid-inexistente con header "X-API-Key: test-key-123"
    Entonces recibo status 404
