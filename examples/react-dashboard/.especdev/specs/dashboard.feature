# language: es
@lista
Característica: Dashboard de Métricas
  Como usuario del dashboard
  Quiero visualizar métricas clave de mi negocio
  Para tomar decisiones basadas en datos

  Antecedentes:
    Dado que el dashboard está cargado en el navegador
    Y que la API de métricas responde correctamente

  @P1
  Escenario: Mostrar KPI cards al cargar
    Cuando el dashboard termina de cargar
    Entonces veo 4 KPI cards con valores numéricos
    Y cada card muestra: título, valor actual y variación porcentual
    Y las variaciones positivas se muestran en verde
    Y las variaciones negativas se muestran en rojo

  @P1
  Escenario: Gráfico de línea muestra tendencia mensual
    Cuando el dashboard termina de cargar
    Entonces veo un gráfico de línea con datos de los últimos 12 meses
    Y el eje X muestra meses abreviados (Ene, Feb, Mar...)
    Y el eje Y muestra valores con formato numérico

  @P1
  Escenario: Gráfico de barras muestra comparación por categoría
    Cuando el dashboard termina de cargar
    Entonces veo un gráfico de barras con 5 categorías
    Y cada barra tiene un tooltip con el valor exacto al hacer hover

  @P1
  Escenario: Filtrar por rango de fechas
    Dado que el dashboard muestra datos del último mes
    Cuando selecciono el rango "Últimos 3 meses"
    Entonces los KPI cards se actualizan con nuevos valores
    Y los gráficos se re-renderizan con el nuevo rango
    Y veo un indicador de carga durante la transición

  @P1
  Escenario: Estado de carga mientras se obtienen datos
    Cuando el dashboard está cargando datos de la API
    Entonces veo skeletons animados en lugar de los componentes
    Y no veo datos parciales o erróneos

  @P1
  Escenario: Manejar error de API
    Dado que la API de métricas falla con status 500
    Cuando el dashboard intenta cargar
    Entonces veo un mensaje de error descriptivo
    Y un botón "Reintentar" que re-ejecuta la llamada

  @P2
  Escenario: Responsive en tablet
    Dado que el viewport es de 768px de ancho
    Cuando el dashboard se renderiza
    Entonces los KPI cards se muestran en grid de 2 columnas
    Y los gráficos ocupan el ancho completo

  @P2
  Escenario: Responsive en móvil
    Dado que el viewport es de 375px de ancho
    Cuando el dashboard se renderiza
    Entonces los KPI cards se muestran en 1 columna
    Y los gráficos son scrolleables horizontalmente

  @P2
  Escenario: Persistir filtro seleccionado
    Dado que selecciono el rango "Últimos 6 meses"
    Cuando recargo la página
    Entonces el filtro mantiene "Últimos 6 meses" seleccionado

  @P3
  Escenario: Exportar datos como CSV
    Dado que el dashboard muestra datos
    Cuando hago click en el botón "Exportar CSV"
    Entonces se descarga un archivo CSV con los datos actuales
