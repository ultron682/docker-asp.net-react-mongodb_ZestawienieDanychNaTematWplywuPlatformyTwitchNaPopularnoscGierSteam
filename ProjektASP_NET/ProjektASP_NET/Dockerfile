# Użyj obrazu ASP.NET jako podstawy dla końcowego obrazu
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# Ustaw użytkownika na 'app'
USER app
# Ustaw katalog roboczy
WORKDIR /app
# Eksponuj port 8080
EXPOSE 8080

# Użyj obrazu SDK .NET do budowania aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# Zdefiniuj argument dla konfiguracji budowania, domyślnie Release
ARG BUILD_CONFIGURATION=Release
# Ustaw katalog roboczy
WORKDIR /src
# Skopiuj plik projektu do katalogu roboczego
COPY ["ProjektASP_NET/ProjektASP_NET.csproj", "ProjektASP_NET/"]
# Przywróć zależności dla projektu
RUN dotnet restore "./ProjektASP_NET/ProjektASP_NET.csproj"
# Skopiuj resztę kodu źródłowego
COPY . .
# Ustaw katalog roboczy na katalog projektu
WORKDIR "/src/ProjektASP_NET"
# Zbuduj projekt w zadanej konfiguracji i wyjściu do katalogu /app/build
RUN dotnet build "./ProjektASP_NET.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Użyj fazy build jako fazy publish
FROM build AS publish
# Zdefiniuj argument dla konfiguracji budowania, domyślnie Release
ARG BUILD_CONFIGURATION=Release
# Opublikuj projekt do katalogu /app/publish bez AppHost
RUN dotnet publish "./ProjektASP_NET.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Użyj obrazu base jako obrazu końcowego
FROM base AS final
# Ustaw katalog roboczy
WORKDIR /app
# Skopiuj opublikowane pliki z fazy publish do katalogu roboczego
COPY --from=publish /app/publish .
# Ustaw punkt wejścia dla uruchomienia aplikacji
ENTRYPOINT ["dotnet", "ProjektASP_NET.dll"]
