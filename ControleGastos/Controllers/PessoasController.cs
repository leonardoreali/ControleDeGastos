using ControleGastos.Data;
using ControleGastos.Models;
using ControleGastos.Data;
using ControleGastos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.API.Controllers
{
	// A rota será: https://localhost:porta/api/pessoas
	[Route("api/[controller]")]
	[ApiController]
	public class PessoasController : ControllerBase
	{
		private readonly AppDbContext _context;

		//Injeção de dependência do DbContext
		public PessoasController(AppDbContext context)
		{
			_context = context;
		}

		// GET: api/pessoas
		// Serve para LISTAR todas as pessoas.
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
		{
			// Vai no banco, converte a tabela Pessoas para uma lista e retorna.
			return await _context.Pessoas.ToListAsync();
		}

		// GET: api/pessoas/5
		// Serve para buscar UMA pessoa específica pelo ID.
		[HttpGet("{id}")]
		public async Task<ActionResult<Pessoa>> GetPessoa(int id)
		{
			var pessoa = await _context.Pessoas.FindAsync(id);

			if (pessoa == null)
			{
				return NotFound(); // Retorna erro 404 se não achar ninguem.
			}

			return pessoa;
		}

		// POST: api/pessoas
		// Serve para criar uma nova pessoa.
		[HttpPost]
		public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
		{
			// Adiciona o objeto na memória do EF
			_context.Pessoas.Add(pessoa);

			// Comita a transação no banco de dados real
			await _context.SaveChangesAsync();

			// Retorna o código 201 (Created) e os dados da pessoa criada (com o ID gerado)
			return CreatedAtAction("GetPessoa", new { id = pessoa.Id }, pessoa);
		}

		// DELETE: api/pessoas/5
		// Serve para APAGAR uma pessoa.
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeletePessoa(int id)
		{
			var pessoa = await _context.Pessoas.FindAsync(id);
			if (pessoa == null)
			{
				return NotFound();
			}

			// Antes de apagar a pessoa, busca e apaga as contas dela.
			var transacoesDaPessoa = _context.Transacoes.Where(t => t.PessoaId == id);
			_context.Transacoes.RemoveRange(transacoesDaPessoa);


			_context.Pessoas.Remove(pessoa);
			await _context.SaveChangesAsync();

			return NoContent();
		}
		// GET: api/Pessoas/Totais
		// Este endpoint calcula o resumo financeiro de cada pessoa
		[HttpGet("Totais")]
		public async Task<ActionResult> GetTotais()
		{
			// 1. Busca todas as pessoas e transações do banco
			var pessoas = await _context.Pessoas.ToListAsync();
			var transacoes = await _context.Transacoes.ToListAsync();

			// 2. Cria uma lista para guardar o resumo
			var resumo = new List<object>();

			// Variáveis para o Total Geral da casa
			decimal totalGeralReceitas = 0;
			decimal totalGeralDespesas = 0;

			// 3. Para cada pessoa, calcula quanto ela gastou/ganhou
			foreach (var pessoa in pessoas)
			{
				// Filtra as transações dessa pessoa
				var transacoesDaPessoa = transacoes.Where(t => t.PessoaId == pessoa.Id).ToList();

				// Soma as receitas e despesas
				decimal receitas = transacoesDaPessoa.Where(t => t.Tipo == "Receita").Sum(t => t.Valor);
				decimal despesas = transacoesDaPessoa.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor);
				decimal saldo = receitas - despesas;

				// Adiciona ao total geral
				totalGeralReceitas += receitas;
				totalGeralDespesas += despesas;

				// Adiciona na lista de resumo
				resumo.Add(new
				{
					Id = pessoa.Id,
					Nome = pessoa.Nome,
					Receitas = receitas,
					Despesas = despesas,
					Saldo = saldo
				});
			}

			// 4. Monta o pacote final com o resumo por pessoa + o total geral
			var resultadoFinal = new
			{
				Pessoas = resumo,
				TotalGeral = new
				{
					Receitas = totalGeralReceitas,
					Despesas = totalGeralDespesas,
					SaldoLiquido = totalGeralReceitas - totalGeralDespesas
				}
			};

			return Ok(resultadoFinal);
		}
	}

}