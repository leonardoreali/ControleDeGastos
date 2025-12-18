using ControleGastos.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Data
{
	// O AppDbContext herda de DbContext, que é a classe base do Entity Framework.
	public class AppDbContext : DbContext
	{
		// O construtor recebe as configurações (como a string de conexão) e passa para a base.
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
		}

		// DbSet representa a tabela no banco de dados.
		// O nome 'Pessoas' será o nome da tabela criada no SQL Server.
		public DbSet<Pessoa> Pessoas { get; set; }

		public DbSet<Categoria> Categorias { get; set; }
		public DbSet<Transacao> Transacoes { get; set; }
	}
}
