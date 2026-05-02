using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Linksy.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeShortCodeIndexToUserScoped : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Links_ShortCode",
                table: "Links");

            migrationBuilder.DropIndex(
                name: "IX_Links_UserId",
                table: "Links");

            migrationBuilder.CreateIndex(
                name: "IX_Links_UserId_ShortCode",
                table: "Links",
                columns: new[] { "UserId", "ShortCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Links_UserId_ShortCode",
                table: "Links");

            migrationBuilder.CreateIndex(
                name: "IX_Links_ShortCode",
                table: "Links",
                column: "ShortCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Links_UserId",
                table: "Links",
                column: "UserId");
        }
    }
}
