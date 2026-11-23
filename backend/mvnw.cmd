@echo off
setlocal
set "BASE=%~dp0"
set "WRAPPER_JAR=%BASE%.mvn\wrapper\maven-wrapper.jar"
if not exist "%WRAPPER_JAR%" (
  echo Descargando Maven Wrapper oficial...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '%WRAPPER_JAR%'"
  if errorlevel 1 (echo ERROR: no se pudo descargar Maven Wrapper. Revise internet. & exit /b 1)
)
java "-Dmaven.multiModuleProjectDirectory=%CD%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %errorlevel%
