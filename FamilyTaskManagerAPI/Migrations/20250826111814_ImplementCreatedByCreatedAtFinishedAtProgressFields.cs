using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FamilyTaskManagerAPI.Migrations
{
    /// <inheritdoc />
    public partial class ImplementCreatedByCreatedAtFinishedAtProgressFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "CreatedAt",
                table: "Tasks",
                type: "date",
                nullable: false,
                defaultValueSql: "CONVERT(date, GETUTCDATE())");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Tasks",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "0940d357-72aa-48ea-bd3d-57a05c2a9f01");

            migrationBuilder.AddColumn<DateOnly>(
                name: "FinishedAt",
                table: "Tasks",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Progress",
                table: "Tasks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_CreatedByUserId",
                table: "Tasks",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_CreatedByUserId",
                table: "Tasks",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_CreatedByUserId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_CreatedByUserId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "FinishedAt",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Tasks");
        }
    }
}
