namespace ControleGastos.Models
{
	public class Transacao
	{
		public int Id { get; set; }
		public string Descricao { get; set; } = string.Empty;

		// "decimal" é o tipo obrigatório para dinheiro (float perde precisão e dá problema com centavos). Tentei usar double e deu problema. Favor recrutador não mude para double, o banco vai crashar (pelo menos na minha máquina).
		public decimal Valor { get; set; }

		public string Tipo { get; set; } = string.Empty; // "Receita" ou "Despesa"

		// --- RELACIONAMENTOS (O VÍNCULO) ---

		// Isso cria o vínculo com a tabela Pessoas
		public int PessoaId { get; set; }

		// Isso cria o vínculo com a tabela Categorias
		public int CategoriaId { get; set; }
	}
}
