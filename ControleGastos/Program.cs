using ControleGastos.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. ADICIONA OS SERVIÇOS ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura o Banco de Dados (Copia a conexão do appsettings)
builder.Services.AddDbContext<AppDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configura o CORS (Permite que o React converse com o C#)
builder.Services.AddCors(options =>
{
	options.AddPolicy("PermitirTudo", policy =>
	{
		policy.AllowAnyOrigin()  // Aceita qualquer site (localhost:5173, etc)
			  .AllowAnyMethod()  // Aceita GET, POST, PUT, DELETE
			  .AllowAnyHeader(); // Aceita qualquer cabeçalho
	});
});

var app = builder.Build();

// --- 2. CONFIGURA O APLICATIVO ---

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ATIVA O CORS (Importante: Tem que vir antes do Authorization)
app.UseCors("PermitirTudo");

app.UseAuthorization();

app.MapControllers();

app.Run();