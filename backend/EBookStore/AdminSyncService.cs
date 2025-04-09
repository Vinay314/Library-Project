using System.Text.Json;
using System.Text.Json.Nodes;
using System.IO;

public class AdminSyncService
{
    private readonly string iniPath = @"C:\Users\a90011879\source\repos\Library-Project2\src\Admin.ini";
    private readonly string jsonPath = @"C:\Users\a90011879\source\repos\Library-Project2\backend\EBookStore\appsettings.json";
    private FileSystemWatcher _watcher;

    public void StartWatching()
    {
        string directory = Path.GetDirectoryName(iniPath);
        string filename = Path.GetFileName(iniPath);

        if (string.IsNullOrEmpty(directory) || !Directory.Exists(directory))
        {
            Console.WriteLine($"Invalid iniPath directory: {directory}");
            return;
        }

        _watcher = new FileSystemWatcher(directory, filename)
        {
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size,
            EnableRaisingEvents = true
        };

        _watcher.Changed += (_, __) =>
        {
            
            Thread.Sleep(200);
            SyncAdmins();
        };

        Console.WriteLine($" Watching {iniPath} for changes...");
        SyncAdmins(); 
    }

    private void SyncAdmins()
    {
        try
        {
            Console.WriteLine("Syncing admin emails...");

            var iniLines = File.ReadAllLines(iniPath)
                               .Select(line => line.Trim())
                               .Where(line => !string.IsNullOrWhiteSpace(line))
                               .Distinct()
                               .ToList();

            var json = File.ReadAllText(jsonPath);
            var root = JsonNode.Parse(json)?.AsObject();
            if (root is null) return;

            // Replace AdminUsers entirely with the new list
            var newAdminArray = new JsonArray();
            foreach (var email in iniLines)
            {
                newAdminArray.Add(email);
            }

            root["AdminUsers"] = newAdminArray;

            var updatedJson = root.ToJsonString(new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(jsonPath, updatedJson);

            Console.WriteLine("Synced AdminUsers from Admin.ini");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error syncing admin emails: {ex.Message}");
        }
    }

}
