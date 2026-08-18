# Stage 1 - Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY LearnHub.Api/LearnHub.Api.csproj LearnHub.Api/
COPY LearnHub.Data//LearnHub.Data.csproj LearnHub.Data/
RUN dotnet restore LearnHub.Api/LearnHub.Api.csproj

COPY LearnHub.Api/ LearnHub.Api/
COPY LearnHub.Data/ LearnHub.Data/
RUN dotnet publish LearnHub.Api/LearnHub.Api.csproj -c Release -o /app/publish --no-restore

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT [ "dotnet", "LearnHub.Api.dll" ]