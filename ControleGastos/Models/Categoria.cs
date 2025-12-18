namespace ControleGastos.Models
{
	public class Categoria
	{
		public int Id { get; set; }

		public string Descricao { get; set; } = string.Empty;

		// Aqui vamos aceitar apenas: "Receita", "Despesa" ou "Ambas". O frontend vai lidar com o resto
		public string Finalidade { get; set; } = string.Empty;
	}
}
