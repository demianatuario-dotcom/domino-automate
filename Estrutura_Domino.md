# Arquitetura Consolidada do Ecossistema Web — Domino Automate

> **Domínio Principal:** https://domino-automate.com.br/
> **Razão Social:** DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA (CNPJ: 66.699.218/0001-94)
> **Sede:** Brasília - DF | **Liderança Técnica:** Demian Lisboa Pereira (Atuário MIBA 1807 • Engenheiro de Sistemas & IA)
> **Stack Principal:** Next.js 16.2.3 (App Router) • React 19 • TypeScript • PostgreSQL (`pg`) • Google Gemini (`@google/genai` — `gemini-2.5-flash`) • N8N Webhook • Coolify VPS (Docker/Nixpacks)

---

## 1. Visão Geral da Arquitetura (Hub & Spoke Multi-Segmentos)

O ecossistema digital da **Domino Automate** opera sob uma arquitetura **Hub & Spoke (1 Portal Institucional Raiz + 10 Subpastas Verticais Especializadas)** dentro de um único monolito modular Next.js.

### Objetivos Estratégicos da Estrutura
1. **Evitar Sombreamento de Posicionamento:** O portal raiz (`/`) apresenta exclusivamente a empresa de engenharia de software, automação e IA (**Domino Automate**), sem misturar jargões atuariais com varejo ou estética.
2. **Hiper-Segmentação por Público-Alvo (1:1):** Cada uma das 10 subpastas funciona como uma *Landing Page* independente de resposta direta, com paleta de cores, vocabulário, dores (framework *PAS: Problem-Agitation-Solution*), simulador financeiro de ROI e consultor de IA moldados exatamente para o decisor daquele mercado.
3. **URLs Canônicas Limpas (ASCII):** Todas as subpastas utilizam rotas canônicas sem acentuação (`/Atuaria`, `/Estudios`, `/Saloes`, etc.) para evitar codificação percentual (`%C3%A1`, `%C3%BA`) no navegador e em campanhas de tráfego pago, enquanto o `middleware.ts` intercepta variações digitadas com acento, em minúsculas ou no singular e aplica redirecionamento permanente (`HTTP 308`).

---

## 2. Matriz Resumida dos 11 Ambientes

| Ambiente / Rota | Público-Alvo Primário | Conceito Estético | Fundo Principal (`bgPrimary`) | Cor de Destaque (`accentPrimary`) | Raio de Borda (`borderRadius`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`/` (Raiz)** | Executivos, Empresários e Decisores | *Sovereign Tech Hub* | `#0A0E14` (Obsidian Navy) | `#E9C176` (Sovereign Gold) | `6px` |
| **`/Atuaria`** | Diretores de EFPCs, Patrocinadoras e Bancas Jurídicas | *Sovereign Financial & Actuarial* | `#0A0E14` / `#0D2344` | `#E9C176` (Ouro Institucional) | `4px` (Rigoroso) |
| **`/Estudios`** | Donas de Estúdios de Beleza, Lash/Brow e Estética | *Obsidian Rose & Champagne* | `#110D10` (Obsidian Rose) | `#D4AF37` / `#E5C07B` (Champagne) | `12px` (Suave/Luxo) |
| **`/Saloes`** | Gestores de Salões de Beleza e Hair Studios | *Warm Terracotta & Rose Gold* | `#140F0D` (Espresso Warm) | `#D98A6C` (Terracotta Rose) | `14px` (Editorial) |
| **`/Barbearias`** | Donos de Barbearias e Clubes de Assinatura | *Vintage Bourbon & Amber Brass* | `#0F0D0B` (Charcoal Leather) | `#D97706` (Amber Bourbon) | `6px` (Industrial) |
| **`/Advocacia`** | Sócios de Escritórios de Advocacia | *Oxford Slate, Ivory & Gold* | `#0B0F17` (Oxford Midnight) | `#C5A059` (Classic Legal Gold) | `4px` (Clássico/Sóbrio) |
| **`/Contabilidade`** | Contadores, Consultores Fiscais e BPO | *Financial Emerald & Graphite* | `#091318` (Deep Slate) | `#10B981` (Financial Emerald) | `8px` (Analítico) |
| **`/Farmacias`** | Rede de Drogarias e Farmácias de Manipulação | *Clinical Teal & Vital Cyan* | `#081417` (Clinical Dark Teal) | `#0EA5E9` / `#2DD4BF` (Cyan/Mint) | `10px` (Clínico) |
| **`/Oticas`** | Proprietários de Óticas e Boutiques Visuais | *Editorial Amber & Onyx* | `#11100E` (High-Contrast Onyx) | `#EAB308` (Optical Amber Gold) | `8px` (Precisão) |
| **`/Odontologia`** | Cirurgiões-Dentistas e Clínicas Odontológicas | *Pure Titanium & Ice Blue* | `#09131C` (Titanium Navy) | `#0284C7` / `#38BDF8` (Ice Blue) | `12px` (Asséptico/Moderno) |
| **`/Varejo`** | Lojistas de Rua, Shopping e Franquias Físicas | *Signal Orange & Dynamic Slate* | `#101216` (Commercial Slate) | `#F97316` (Conversion Orange) | `10px` (Dinâmico) |

*(Consulte o documento completo na raiz do workspace `../Estrutura_Domino.md` para o diagrama de arquitetura e o prompt de auditoria para o ChatGPT).*

