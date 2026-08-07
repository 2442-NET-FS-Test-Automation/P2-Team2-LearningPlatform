using System.Net.Http.Headers;

namespace LearnHub.Tests;

public static class TestAuthenticationExtensions
{
    public static void LoginAsAdmin(this HttpClient client)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Role");
        client.DefaultRequestHeaders.Remove("X-Test-UserId");
        client.DefaultRequestHeaders.Remove("X-Test-Username");

        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");
        client.DefaultRequestHeaders.Add("X-Test-UserId", "1");
        client.DefaultRequestHeaders.Add("X-Test-Username", "admin");
    }

    public static void LoginAsProfessor(
        this HttpClient client,
        int professorId = 2)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Role");
        client.DefaultRequestHeaders.Remove("X-Test-UserId");
        client.DefaultRequestHeaders.Remove("X-Test-Username");

        client.DefaultRequestHeaders.Add("X-Test-Role", "Professor");
        client.DefaultRequestHeaders.Add("X-Test-UserId", professorId.ToString());
        client.DefaultRequestHeaders.Add("X-Test-Username", "professor");
    }

    public static void LoginAsStudent(
        this HttpClient client,
        int studentId = 3)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Role");
        client.DefaultRequestHeaders.Remove("X-Test-UserId");
        client.DefaultRequestHeaders.Remove("X-Test-Username");

        client.DefaultRequestHeaders.Add("X-Test-Role", "Student");
        client.DefaultRequestHeaders.Add("X-Test-UserId", studentId.ToString());
        client.DefaultRequestHeaders.Add("X-Test-Username", "student");
    }

    public static void Logout(this HttpClient client)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Role");
        client.DefaultRequestHeaders.Remove("X-Test-UserId");
        client.DefaultRequestHeaders.Remove("X-Test-Username");
    }
}