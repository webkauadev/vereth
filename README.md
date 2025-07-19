# Vareth: O Selo

Aventura narrativa em texto para rodar no terminal usando Node.js.

## Como jogar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o jogo:
   ```bash
   npm start
   ```

## Sistemas principais

- **Ritual do Reflexo**: cinco perguntas moldam os atributos do herói.
- **Exploração**: salas descritas de forma poética, cada uma com ações próprias.
- **Diário**: em algumas salas é possível desbloquear fragmentos ao testar um atributo.
- **Memórias**: use `diario` e depois `refletir` (ou `lembrar`, `pensar`) para tentar descobrir novas frases. O comando `memorias` exibe as já desbloqueadas.
- **Reflexo no lago**: na Floresta Inquieta, use `olhar` (ou `encarar`). Há uma chance em mil de revelar o nome "Quirrel" e registrar uma memória.
- **Combate e Piedade**: encontros com inimigos exigem coragem ou permitem poupar, gerando consequências aleatórias.
- **Muwon**: a primeira visita à Clareira da Lembrança inicia automaticamente um combate contra o infectado.
- **Itens**: algumas salas escondem objetos coletáveis usando o comando `vasculhar`.
- **Portal Quebrado**: exige três itens para ativar o caminho ao Ato II.
- **Diálogo final**: ao coletar todos os fragmentos do diário, escolha uma pergunta ao Ancião (perguntas perdidas não aparecem na lista).
- **Ancião**: atributo calculado automaticamente a partir de memória, vontade e vínculo.

Este projeto está em desenvolvimento e serve como demonstração de um jogo em linha de comando.
