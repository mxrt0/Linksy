using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Linksy.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceAnalytics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Browser",
                table: "Clicks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeviceType",
                table: "Clicks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OperatingSystem",
                table: "Clicks",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Browser",
                table: "Clicks");

            migrationBuilder.DropColumn(
                name: "DeviceType",
                table: "Clicks");

            migrationBuilder.DropColumn(
                name: "OperatingSystem",
                table: "Clicks");
        }
    }
}
