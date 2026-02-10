# 🚀 Guia Completo: Claude no VSCode para seu Projeto de Viagens

## 📋 O que você precisa saber

A extensão oficial do Claude para VSCode é diferente do Cursor. Ela precisa de:
1. **Arquivos de configuração** (.clinerules ou .clauderules)
2. **Skills personalizadas** (opcional mas recomendado)
3. **Escolha do modelo certo** para cada tarefa
4. **Prompts estruturados** adequados

---

## 1️⃣ ESTRUTURA BÁSICA DO PROJETO

```
seu-projeto-viagem/
├── .clinerules                    # Regras globais do projeto
├── src/
│   ├── components/
│   │   └── .clinerules           # Regras específicas para componentes
│   ├── pages/
│   │   └── .clinerules           # Regras específicas para páginas
│   └── styles/
│       └── .clinerules           # Regras específicas para estilos
└── .claude/
    └── skills/                    # Skills personalizadas
        ├── travel-ui-design/
        │   └── SKILL.md
        └── travel-components/
            └── SKILL.md
```

---

## 2️⃣ ARQUIVO .clinerules (RAIZ DO PROJETO)

Crie este arquivo na raiz do seu projeto:

```markdown
# Projeto de Viagens - Regras Globais

## Sobre o Projeto
Este é um aplicativo de compartilhamento de fotos de viagens nas redes sociais.
Stack: React/Next.js, TypeScript, TailwindCSS, Supabase

## Identidade Visual
- **Paleta**: Sunset Orange (#FF6B35), Ocean Blue (#004E89), Sand Cream (#FFF8F0)
- **Tipografia**: Playfair Display (títulos), Instrument Sans (corpo)
- **Tema**: Aventura, conexão, inspiração para viagens
- **Estética**: Moderna, clean, inspirada em Apple/Notion/Linear

## Princípios de Design
1. **Mobile First**: Sempre pensar mobile primeiro
2. **Performance**: Otimizar imagens, lazy loading
3. **Acessibilidade**: WCAG 2.1 AA mínimo
4. **Micro-interações**: Feedback visual em todas ações
5. **Zero Scroll**: Quando possível, interfaces sem scroll

## Regras de Código
- Usar TypeScript strict mode
- Componentes funcionais com hooks
- Tailwind para estilização (sem CSS modules)
- Nomenclatura: PascalCase para componentes, camelCase para funções
- Sempre tipar props e retornos

## Quando criar componentes UI
- Evitar bibliotecas de UI prontas (shadcn/ui, Material-UI, etc.)
- Criar componentes customizados alinhados com a identidade visual
- Reusar componentes de design system interno
- Sempre considerar estados: default, hover, active, disabled, loading

## Estrutura de Componentes
```tsx
// Sempre seguir este padrão
import { useState } from 'react';

interface ComponentProps {
  // Props aqui
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Lógica aqui
  
  return (
    // JSX aqui
  );
}
```

## APIs e Dados
- Backend: Supabase
- Autenticação: Supabase Auth (Google, Facebook, Email)
- Storage: Supabase Storage para imagens
- Real-time: Supabase Realtime para feed

## Otimização de Imagens
- Next Image component obrigatório
- Formatos: WebP/AVIF preferred
- Lazy loading padrão
- Blur placeholder sempre que possível
```

---

## 3️⃣ ARQUIVO .clinerules ESPECÍFICO (COMPONENTES)

Crie em `src/components/.clinerules`:

```markdown
# Regras para Componentes

## Estilo dos Componentes
- Sempre usar Tailwind utilities
- Evitar inline styles
- Criar variantes com cva (class-variance-authority) se necessário
- Border radius padrão: rounded-2xl (16px)
- Spacing: usar escala do Tailwind (4, 8, 12, 16, 24, 32, 48)

## Componentes de Formulário
- Sempre incluir labels acessíveis
- Estados de erro visíveis
- Feedback visual em validação
- Loading states em submissions

## Botões
- Primary: gradiente sunset (orange → pink)
- Secondary: outline com hover effect
- Ghost: sem borda, hover com background
- Sempre incluir estados de loading

## Cards de Imagem
- Aspect ratio: 4:3 ou 1:1
- Overlay com gradiente no hover
- Metadados: localização, data, likes
- Lazy loading obrigatório

## Animations
- Usar Framer Motion para animações complexas
- CSS animations para micro-interações
- Sempre respeitar prefers-reduced-motion
```

---

## 4️⃣ CRIANDO UMA SKILL PERSONALIZADA

### Skill: Travel UI Design

Crie a estrutura:
```bash
mkdir -p .claude/skills/travel-ui-design
```

Crie `.claude/skills/travel-ui-design/SKILL.md`:

```markdown
---
name: travel-ui-design
description: Create stunning UI components for travel social media app. Use this skill when building pages, components, or interfaces for the travel photo sharing platform. Triggers include requests for login screens, feed layouts, profile pages, photo galleries, map integrations, or any UI/UX design work related to travel content.
---

# Travel UI Design Skill

## Brand Identity
- **Primary Colors**: 
  - Sunset Orange: #FF6B35
  - Sunset Pink: #FF8C69
  - Ocean Blue: #004E89
  - Sky Blue: #1A8FE3
  - Sand Cream: #FFF8F0

- **Typography**:
  - Display: Playfair Display (700, 800)
  - Body: Instrument Sans (400, 500, 600, 700)

- **Visual Language**: 
  - Travel-inspired imagery
  - Organic shapes and rounded corners
  - Gradient overlays on images
  - Micro-animations for delight

## Component Patterns

### Layout Components
- **Container**: max-w-7xl, padding horizontal, centered
- **Grid**: 1-2-3 column responsive grid for photos
- **Stack**: vertical/horizontal spacing utilities

### Interactive Elements
- **Buttons**: 
  - Height: 48-56px
  - Border radius: 12-16px
  - Hover: translateY(-2px) + enhanced shadow
  - Primary: gradient background
  - Secondary: border with background on hover

- **Inputs**:
  - Height: 48-52px
  - Border: 1.5px solid
  - Focus: blue ring + border color change
  - Border radius: 12-16px

### Travel-Specific Components
- **Photo Card**: 
  - Aspect ratio locked
  - Location tag overlay
  - Like/comment counts
  - Hover reveal actions

- **Location Tag**:
  - Pin icon + location name
  - Semi-transparent background
  - Positioned bottom-left on images

- **Trip Timeline**:
  - Vertical line connecting destinations
  - Date badges
  - Photo thumbnails

## Animation Guidelines
- **Page Transitions**: 0.3s ease-out
- **Hover Effects**: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
- **Loading States**: Skeleton screens with shimmer
- **Micro-interactions**: Scale, opacity, translateY

## Accessibility Requirements
- All images must have alt text
- Minimum contrast ratio: 4.5:1
- Focus indicators on all interactive elements
- Keyboard navigation support
- ARIA labels for icon-only buttons

## Mobile Optimization
- Touch targets: minimum 44x44px
- Swipe gestures for galleries
- Bottom navigation bar
- Full-screen image viewer
- Pull-to-refresh on feed

## Example Component Structures

### Photo Card Component
```tsx
interface PhotoCardProps {
  imageUrl: string;
  location: string;
  likes: number;
  comments: number;
  author: {
    name: string;
    avatar: string;
  };
}

export function PhotoCard({ imageUrl, location, likes, comments, author }: PhotoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-square relative">
        <Image 
          src={imageUrl} 
          alt={location}
          fill
          className="object-cover"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Location Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <MapPinIcon className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">{location}</span>
        </div>
      </div>
      
      {/* Meta Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition-colors">
              <HeartIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors">
              <ChatIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{comments}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <Image 
              src={author.avatar} 
              alt={author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium">{author.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Best Practices
1. Always create mobile-responsive layouts
2. Use semantic HTML elements
3. Implement loading states for async operations
4. Add error boundaries for components
5. Optimize images with Next.js Image component
6. Use CSS variables for theme values
7. Implement dark mode support when applicable
8. Test with screen readers
```

---

## 5️⃣ ESCOLHENDO O MODELO CERTO

### Claude Sonnet 4 (Padrão) ✅
**Use para:**
- Design de UI/UX
- Criação de componentes React
- Refatoração de código
- Debugging
- Code reviews
- Maior parte do desenvolvimento

**Características:**
- Balanceado entre velocidade e qualidade
- Excelente para tarefas de desenvolvimento
- Custo-benefício ideal

### Claude Opus 4 💎
**Use para:**
- Arquitetura de sistema complexa
- Decisões críticas de design
- Problemas muito difíceis
- Quando Sonnet não conseguiu resolver

**Características:**
- Mais inteligente e criativo
- Mais lento e mais caro
- Use apenas quando necessário

### Claude Haiku 4 ⚡
**Use para:**
- Tarefas simples e rápidas
- Formatação de código
- Pequenas correções
- Auto-complete inteligente

**Características:**
- Muito rápido
- Barato
- Bom para tarefas menores

---

## 6️⃣ COMO USAR NA PRÁTICA

### Exemplo 1: Criar Componente de Login

**Prompt ruim** ❌:
```
crie um login
```

**Prompt bom** ✅:
```
Crie um componente de login para o app de viagens seguindo as regras do projeto.
Deve incluir:
- Login social (Google, Facebook)
- Email/senha
- Toggle de visualização de senha
- Validação em tempo real
- Estados de loading
- Design sem scroll necessário
- Identidade visual do projeto (cores sunset/ocean)

Use TypeScript e Tailwind. O componente deve ser mobile-first.
```

### Exemplo 2: Feed de Fotos

**Prompt ruim** ❌:
```
faz um feed de fotos
```

**Prompt bom** ✅:
```
Crie a página de Feed de fotos de viagens com:
- Grid responsivo (1 coluna mobile, 2-3 desktop)
- Lazy loading de imagens
- Infinite scroll
- Cards com: imagem, localização, autor, likes, comentários
- Filtros por destino
- Animações suaves no hover
- Performance otimizada

Siga o design system do projeto (.clinerules) e use a travel-ui-design skill.
```

### Exemplo 3: Refatoração

**Prompt bom** ✅:
```
Refatore este componente seguindo as regras do projeto:
- Adicionar TypeScript
- Melhorar acessibilidade
- Otimizar performance
- Adicionar estados de loading
- Implementar tratamento de erros
- Usar nomenclatura consistente

[cole seu código aqui]
```

---

## 7️⃣ COMANDOS ÚTEIS NO CHAT

### Iniciar nova feature:
```
@workspace Vou criar uma nova feature de [NOME]. 
Revise os arquivos .clinerules e me ajude a estruturar.
```

### Pedir análise de código:
```
Analise este arquivo seguindo as regras do projeto:
[arquivo]

Sugira melhorias em:
- Performance
- Acessibilidade
- Padrões do projeto
- TypeScript
```

### Debug com contexto:
```
Estou tendo este erro:
[erro]

Contexto do projeto: [descreva brevemente]
Arquivo afetado: [caminho]

Ajude-me a resolver seguindo as convenções do projeto.
```

---

## 8️⃣ WORKFLOW RECOMENDADO

### Setup Inicial (faça uma vez):
1. ✅ Criar `.clinerules` na raiz
2. ✅ Criar `.clinerules` em cada pasta importante
3. ✅ Criar skill `travel-ui-design`
4. ✅ Documentar design system

### Desenvolvimento Diário:
1. **Antes de codar**: Pergunte ao Claude sobre a abordagem
   ```
   Qual a melhor forma de implementar [feature] 
   seguindo as regras do projeto?
   ```

2. **Durante o desenvolvimento**: Use o Claude como pair programmer
   ```
   Escreva o componente [Nome] com [requisitos]
   seguindo o design system
   ```

3. **Code Review**: Peça revisão antes de commitar
   ```
   Revise este código quanto a:
   - Padrões do projeto
   - Performance
   - Acessibilidade
   - Segurança
   ```

4. **Refatoração**: Melhore código existente
   ```
   Refatore seguindo as melhores práticas do projeto
   ```

---

## 9️⃣ DICAS AVANÇADAS

### Use o contexto do workspace:
```
@workspace Mostre todos os componentes de botão
existentes antes de eu criar um novo
```

### Peça para seguir padrões existentes:
```
Crie um componente similar ao PhotoCard mas para Stories.
Use o mesmo estilo e padrões.
```

### Combine com arquivos específicos:
```
@components/Button.tsx 
Crie uma variante 'travel' deste botão usando 
as cores do projeto
```

### Iteração rápida:
```
Ajuste o espaçamento para ser mais consistente com o resto do app
```

---

## 🎯 CHECKLIST DE QUALIDADE

Antes de considerar uma feature pronta, verifique:

- [ ] Segue as cores do brand (sunset/ocean)
- [ ] Tipografia correta (Playfair/Instrument Sans)
- [ ] Border radius 12-16px
- [ ] Animações suaves (hover, transitions)
- [ ] Mobile responsive
- [ ] Estados de loading implementados
- [ ] Tratamento de erros
- [ ] Acessibilidade (WCAG AA)
- [ ] TypeScript sem erros
- [ ] Performance otimizada (imagens, lazy load)
- [ ] Comentários em código complexo

---

## 🚨 ERROS COMUNS

### ❌ Não fazer isso:
```
crie uma página de login bonita
```
**Por quê?** Vago demais, Claude não sabe suas preferências.

### ✅ Fazer isso:
```
Crie uma página de login seguindo as regras em .clinerules,
usando a skill travel-ui-design, com design split-screen
inspirado em apps de viagem modernos.
```

### ❌ Não fazer isso:
Pedir para usar bibliotecas genéricas:
```
use shadcn/ui para os componentes
```

### ✅ Fazer isso:
```
Crie componentes customizados seguindo nosso design system
definido em .clinerules
```

---

## 📚 RECURSOS ADICIONAIS

### Links Úteis:
- [Documentação Claude for VSCode](https://docs.claude.com)
- [Guia de Prompts](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Skills Examples](https://github.com/anthropics/anthropic-cookbook)

### Comunidade:
- Discord da Anthropic
- Reddit: r/ClaudeAI
- Twitter: @AnthropicAI

---

## 🎓 PRÓXIMOS PASSOS

1. **Hoje**: Crie seus arquivos `.clinerules`
2. **Amanhã**: Crie sua primeira skill customizada
3. **Essa semana**: Experimente diferentes prompts e veja o que funciona
4. **Esse mês**: Refine suas regras baseado no uso real

---

## 💡 ÚLTIMA DICA

**A diferença entre Cursor e Claude no VSCode:**

- **Cursor**: Mais "mágico", tenta adivinhar o que você quer
- **Claude VSCode**: Mais "explícito", precisa de instruções claras

Você tem MAIS controle com Claude, mas precisa ser mais específico.
É como a diferença entre um assistente que faz o que acha melhor
vs. um assistente que faz exatamente o que você pede.

**Aproveite esse controle!** 🚀
