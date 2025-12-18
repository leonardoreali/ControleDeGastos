using ControleGastos.Data;
using ControleGastos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TransacoesController : ControllerBase
	{
		private readonly AppDbContext _context;

		public TransacoesController(AppDbContext context)
		{
			_context = context;
		}

		// GET: api/Transacoes
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
		{
			// Apenas busca a lista simples. O Frontend faz o trabalho de ligar os nomes.
			return await _context.Transacoes.ToListAsync();
		}

		// POST: api/Transacoes
		[HttpPost]
		public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
		{
			// 1. Busca a Pessoa no banco para saber a idade dela
			var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
			if (pessoa == null) return NotFound("Pessoa não encontrada.");

			// 2. Busca a Categoria para saber a finalidade dela
			var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);
			if (categoria == null) return NotFound("Categoria não encontrada.");

			// --- REGRA DE NEGÓCIO 1: MENOR DE IDADE ---
			// Caso o usuário informe um menor de idade, apenas despesas deverão ser aceitas.
			if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
			{
				return BadRequest("Regra de Negócio: Menores de 18 anos só podem lançar Despesas, não Receitas.");
			}

			// --- REGRA DE NEGÓCIO 2: CATEGORIA COMPATÍVEL ---
			// "Restringir a utilização de categorias conforme o valor definido no campo finalidade."
			// Se a categoria é só de Despesa, não pode lançar Receita nela.
			if (categoria.Finalidade != "Ambas" && categoria.Finalidade != transacao.Tipo)
			{
				return BadRequest($"A categoria '{categoria.Descricao}' é apenas para '{categoria.Finalidade}', mas você tentou lançar uma '{transacao.Tipo}'.");
			}

			_context.Transacoes.Add(transacao);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetTransacoes", new { id = transacao.Id }, transacao);
		}

		// DELETE: api/Transacoes/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTransacao(int id)
		{
			var transacao = await _context.Transacoes.FindAsync(id);
			if (transacao == null)
			{
				return NotFound();
			}

			_context.Transacoes.Remove(transacao);
			await _context.SaveChangesAsync();

			return NoContent();
		}
	}
}
