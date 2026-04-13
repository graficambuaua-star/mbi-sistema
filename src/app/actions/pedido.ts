'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function criarPedido(formData: FormData) {
  const clienteNome = formData.get('clienteNome') as string
  const celular = formData.get('celular') as string
  const descricao = formData.get('descricao') as string
  const observacao = formData.get('observacao') as string | null

  if (!clienteNome || !celular || !descricao) {
    return { error: 'Preencha todos os campos.' }
  }

  try {
    const pedido = await prisma.pedido.create({
      data: {
        clienteNome,
        celular,
        descricao,
        observacao,
        statusAtual: 'CAIXA',
        historico: {
          create: {
            statusDestino: 'CAIXA',
          }
        }
      }
    })

    // Revalidação eficiente para todo o painel
    revalidatePath('/', 'layout')
    
    return { success: true, pedidoId: pedido.id }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return { error: 'Erro ao criar pedido no banco de dados. Verifique a conexão.' }
  }
}

export async function deletarPedido(id: string, _formData?: any): Promise<any> {
  try {
    await prisma.pedido.delete({
      where: { id }
    })
    
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir pedido:", error)
    return { error: 'Erro ao excluir pedido.' }
  }
}

export async function listarPedidos(status: string) {
  return await prisma.pedido.findMany({
    where: { statusAtual: status },
    orderBy: { createdAt: 'asc' },
    include: {
      historico: {
        orderBy: { criadoEm: 'desc' },
        take: 1
      }
    }
  })
}

export async function atualizarStatusPedido(pedidoId: string, novoStatus: string, justificativa?: any): Promise<any> {
  try {
    const pedidoAntigo = await prisma.pedido.findUnique({ where: { id: pedidoId } })
    if (!pedidoAntigo) return { error: 'Pedido não encontrado.' }

    // Se a action for chamada via .bind(), o último argumento será o FormData.
    // Precisamos garantir que a justificativa seja realmente uma string antes de salvar.
    const justificativaFinal = typeof justificativa === 'string' ? justificativa : null

    await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        statusAtual: novoStatus,
        historico: {
          create: {
            statusOrigem: pedidoAntigo.statusAtual,
            statusDestino: novoStatus,
            justificativa: justificativaFinal
          }
        }
      }
    })

    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return { error: 'Erro ao atualizar status.' }
  }
}

export async function obterHistoricoRecente() {
  return await prisma.historicoStatus.findMany({
    orderBy: { criadoEm: 'desc' },
    take: 8,
    include: {
      pedido: {
        select: {
          clienteNome: true,
          descricao: true
        }
      }
    }
  })
}

export async function listarPedidosPorVariosStatus(statuses: string[]) {
  return await prisma.pedido.findMany({
    where: { statusAtual: { in: statuses } },
    orderBy: { updatedAt: 'desc' },
    include: {
      historico: {
        orderBy: { criadoEm: 'desc' },
        take: 1
      }
    }
  })
}
