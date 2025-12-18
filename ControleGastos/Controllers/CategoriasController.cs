using ControleGastos.Data;
using ControleGastos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CategoriasController : ControllerBase
	{
		private readonly AppDbContext _context;

		public CategoriasController(AppDbContext context)
		{
			_context = context;
		}

		// GET: api/Categorias
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
		{
			return await _context.Categorias.ToListAsync();
		}

		// POST: api/Categorias
		[HttpPost]
		public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
		{
			// Validação simples: Finalidade só pode ser "Receita", "Despesa" ou "Ambas"
			if (categoria.Finalidade != "Receita" &&
				categoria.Finalidade != "Despesa" &&
				categoria.Finalidade != "Ambas")
			{
				return BadRequest("A finalidade deve ser: 'Receita', 'Despesa' ou 'Ambas'.");
			}

			_context.Categorias.Add(categoria);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetCategorias", new { id = categoria.Id }, categoria);
		}
	}
}
