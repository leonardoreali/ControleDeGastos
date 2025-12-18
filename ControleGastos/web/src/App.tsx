import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Pessoa } from './types/Pessoa'
import type { Categoria } from './types/Categoria'
import type { Transacao } from './types/Transacao'
import './App.css'

function App() {
  const API_URL = 'https://localhost:7032/api'; 

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Formulários
  const [novoNomePessoa, setNovoNomePessoa] = useState('');
  const [novaIdadePessoa, setNovaIdadePessoa] = useState(0);
  const [novaDescricaoCat, setNovaDescricaoCat] = useState('');
  const [novaFinalidadeCat, setNovaFinalidadeCat] = useState('Despesa');
  
  // Transação
  const [transDescricao, setTransDescricao] = useState('');
  const [transValor, setTransValor] = useState(0);
  const [transTipo, setTransTipo] = useState('Despesa');
  const [transPessoaId, setTransPessoaId] = useState(0);
  const [transCategoriaId, setTransCategoriaId] = useState(0);

  // --- CÁLCULOS GERAIS (Topo da tela) ---
  const totalEntradas = transacoes
    .filter(t => t.tipo === 'Receita')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.tipo === 'Despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoGeral = totalEntradas - totalSaidas;

  // --- CÁLCULO POR PESSOA (Novo Requisito!) ---
  const getTotaisPessoa = (id: number) => {
    const transacoesPessoa = transacoes.filter(t => t.pessoaId === id);
    
    const receita = transacoesPessoa
      .filter(t => t.tipo === 'Receita')
      .reduce((acc, t) => acc + t.valor, 0);
      
    const despesa = transacoesPessoa
      .filter(t => t.tipo === 'Despesa')
      .reduce((acc, t) => acc + t.valor, 0);

    return { receita, despesa, saldo: receita - despesa };
  }

  // --- CARREGAMENTO ---
  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [respPessoas, respCat, respTrans] = await Promise.all([
        axios.get(`${API_URL}/pessoas`),
        axios.get(`${API_URL}/categorias`),
        axios.get(`${API_URL}/transacoes`)
      ]);
      setPessoas(respPessoas.data);
      setCategorias(respCat.data);
      setTransacoes(respTrans.data);
    } catch (error) { console.error("Erro ao carregar:", error); }
  }

  // --- AÇÕES ---
  const deletarPessoa = async (id: number) => {
    if (!window.confirm("Tem certeza? Isso apagará todas as transações dessa pessoa!")) return;
    try {
      await axios.delete(`${API_URL}/pessoas/${id}`);
      // Atualiza localmente
      setPessoas(prev => prev.filter(p => p.id !== id));
      setTransacoes(prev => prev.filter(t => t.pessoaId !== id));
      alert("Pessoa removida!");
    } catch { alert("Erro ao deletar pessoa."); }
  }

  const cadastrarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/pessoas`, { nome: novoNomePessoa, idade: novaIdadePessoa });
      setNovoNomePessoa(''); setNovaIdadePessoa(0);
      carregarDados();
    } catch { alert("Erro ao cadastrar pessoa."); }
  }

  const cadastrarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categorias`, { descricao: novaDescricaoCat, finalidade: novaFinalidadeCat });
      setNovaDescricaoCat('');
      carregarDados();
    } catch { alert("Erro ao cadastrar categoria."); }
  }

  const cadastrarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transPessoaId === 0 || transCategoriaId === 0) { alert("Selecione Pessoa e Categoria!"); return; }
    // --- NOVA VALIDAÇÃO (REGRA DE MENOR DE IDADE) ---
    const pessoaSelecionada = pessoas.find(p => p.id === transPessoaId);
    
    if (pessoaSelecionada && pessoaSelecionada.idade < 18 && transTipo === 'Receita') {
      alert("🚫 Regra do Sistema: Menores de 18 anos não podem ter Receita (apenas Despesas).");
      return; // Para tudo e não envia nada pro Backend
    }
    try {
      await axios.post(`${API_URL}/transacoes`, {
        descricao: transDescricao, valor: transValor, tipo: transTipo,
        pessoaId: transPessoaId, categoriaId: transCategoriaId
      });
      setTransDescricao(''); setTransValor(0); setTransPessoaId(0); setTransCategoriaId(0);
      carregarDados();
    } catch { alert("Erro ao lançar transação."); }
  }

  const getNomePessoa = (id: number) => pessoas.find(p => p.id === id)?.nome || '...';
  const getNomeCategoria = (id: number) => categorias.find(c => c.id === id)?.descricao || '...';

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      
      {/* TOTAIS GERAIS (DASHBOARD) */}
      <div style={{display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center'}}>
        <div className="card" style={{backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', minWidth: '200px'}}>
          <h3>💰 Total Receitas</h3>
          <h2 style={{fontSize: '2em'}}>R$ {totalEntradas.toFixed(2)}</h2>
        </div>
        <div className="card" style={{backgroundColor: '#ffebee', color: '#b71c1c', border: '1px solid #ffcdd2', minWidth: '200px'}}>
          <h3>💸 Total Despesas</h3>
          <h2 style={{fontSize: '2em'}}>R$ {totalSaidas.toFixed(2)}</h2>
        </div>
        <div className="card" style={{
            backgroundColor: saldoGeral >= 0 ? '#e3f2fd' : '#fff3e0', 
            color: saldoGeral >= 0 ? '#0d47a1' : '#e65100',
            border: '1px solid #bbdefb', minWidth: '200px'
          }}>
          <h3>⚖️ Saldo Geral</h3>
          <h2 style={{fontSize: '2em'}}>R$ {saldoGeral.toFixed(2)}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        
        {/* LISTA DE PESSOAS + TOTAIS INDIVIDUAIS */}
        <div className="card" style={{ flex: 2 }}> {/* Aumentei o tamanho desse card */}
          <h3>👤 Totais por Pessoa</h3>
          <form onSubmit={cadastrarPessoa} className="form-inline">
            <input placeholder="Nome" value={novoNomePessoa} onChange={e => setNovoNomePessoa(e.target.value)} required />
            <input type="number" placeholder="Idade" style={{width: '60px'}} value={novaIdadePessoa === 0 ? '' : novaIdadePessoa} onChange={e => setNovaIdadePessoa(Number(e.target.value))} required />
            <button type="submit">+</button>
          </form>
          
          <ul style={{marginTop: '15px', paddingLeft: 0}}>
            {pessoas.map(p => {
              const totais = getTotaisPessoa(p.id);
              return (
                <li key={p.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '10px', borderBottom: '1px solid #444', listStyle: 'none'
                  }}>
                  
                  {/* Info da Pessoa */}
                  <div style={{textAlign: 'left'}}>
                    <span style={{fontSize: '1.1em', fontWeight: 'bold'}}>{p.nome}</span> 
                    <span style={{fontSize: '0.9em', color: '#888', marginLeft: '8px'}}>({p.idade} anos)</span>
                    
                    {/* Totais Individuais */}
                    <div style={{fontSize: '0.85em', marginTop: '4px'}}>
                      <span style={{color: '#66bb6a'}}>Rec: R$ {totais.receita.toFixed(2)}</span> | 
                      <span style={{color: '#ef5350', marginLeft: '8px'}}>Desp: R$ {totais.despesa.toFixed(2)}</span> | 
                      <span style={{color: totais.saldo >= 0 ? '#4fc3f7' : '#ff9800', marginLeft: '8px', fontWeight: 'bold'}}>
                        Saldo: R$ {totais.saldo.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => deletarPessoa(p.id)} style={{backgroundColor: '#ef5350', padding: '5px 10px'}} title="Excluir">🗑️</button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* LISTA DE CATEGORIAS */}
        <div className="card" style={{ flex: 1 }}>
          <h3>🏷️ Categorias</h3>
          <form onSubmit={cadastrarCategoria} className="form-inline">
            <input placeholder="Categoria" value={novaDescricaoCat} onChange={e => setNovaDescricaoCat(e.target.value)} required />
            <select value={novaFinalidadeCat} onChange={e => setNovaFinalidadeCat(e.target.value)}>
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </select>
            <button type="submit">+</button>
          </form>
          <ul style={{paddingLeft: '20px', textAlign: 'left'}}>
            {categorias.map(c => <li key={c.id} style={{marginBottom: '5px'}}>{c.descricao} <small>({c.finalidade})</small></li>)}
          </ul>
        </div>
      </div>

      {/* LANÇAMENTOS */}
      <div className="card" style={{ borderTop: '4px solid #646cff' }}>
        <h2>📝 Lançar Gasto / Receita</h2>
        <form onSubmit={cadastrarTransacao} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input placeholder="Descrição" value={transDescricao} onChange={e => setTransDescricao(e.target.value)} required style={{flex: 2}} />
          <input type="number" step="0.01" placeholder="Valor" value={transValor === 0 ? '' : transValor} onChange={e => setTransValor(Number(e.target.value))} required style={{flex: 1}} />
          <select value={transTipo} onChange={e => setTransTipo(e.target.value)}>
            <option value="Despesa">Saída</option>
            <option value="Receita">Entrada</option>
          </select>
          <select value={transPessoaId} onChange={e => setTransPessoaId(Number(e.target.value))} required>
            <option value={0}>Pessoa...</option>
            {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <select value={transCategoriaId} onChange={e => setTransCategoriaId(Number(e.target.value))} required>
            <option value={0}>Categoria...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
          </select>
          <button type="submit" style={{backgroundColor: '#646cff'}}>Salvar</button>
        </form>

        <hr />
        
        <table style={{width: '100%', marginTop: '20px', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{textAlign: 'left', borderBottom: '1px solid #ccc'}}>
              <th>Descrição</th><th>Quem</th><th>Categoria</th><th>Tipo</th><th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map(t => (
              <tr key={t.id} style={{borderBottom: '1px solid #eee', height: '40px'}}>
                <td>{t.descricao}</td>
                <td>{getNomePessoa(t.pessoaId)}</td>
                <td>{getNomeCategoria(t.categoriaId)}</td>
                <td style={{color: t.tipo === 'Receita' ? 'green' : 'red', fontWeight: 'bold'}}>{t.tipo}</td>
                <td>R$ {t.valor.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App