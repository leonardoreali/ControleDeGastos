namespace ControleGastos.Models
{
	// Esta classe representa a uma Pessoa no banco de dados.
	public class Pessoa
	{
		// O Id será a Chave Primária (PK) e vai ser gerado automaticamente no banco.
		public int Id { get; set; }

		// O Nome da pessoa
		public string Nome { get; set; } = string.Empty;

		// A Idade da pessoa.
		public int Idade { get; set; }
	}
}
