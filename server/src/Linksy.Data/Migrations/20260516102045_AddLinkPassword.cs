using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Linksy.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Links",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Links");
        }
    }
}
