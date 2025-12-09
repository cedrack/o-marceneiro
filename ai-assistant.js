// Sistema de IA para Análise de Preços e Melhorias
class AIAssistant {
    constructor() {
        this.priceAnalysisCache = {};
        this.improvementsCache = null;
    }

    // Análise de Preços
    analyzePrice(product) {
        const cacheKey = `${product.id}_${product.price}`;
        if (this.priceAnalysisCache[cacheKey]) {
            return this.priceAnalysisCache[cacheKey];
        }

        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const categoryProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id);
        
        let analysis = {
            currentPrice: product.price,
            categoryAverage: 0,
            categoryMin: 0,
            categoryMax: 0,
            recommendation: 'manter',
            suggestedPrice: product.price,
            competitiveness: 'média',
            insights: [],
            warnings: []
        };

        if (categoryProducts.length > 0) {
            const prices = categoryProducts.map(p => p.price);
            analysis.categoryAverage = prices.reduce((a, b) => a + b, 0) / prices.length;
            analysis.categoryMin = Math.min(...prices);
            analysis.categoryMax = Math.max(...prices);

            // Análise de competitividade
            if (product.price < analysis.categoryAverage * 0.8) {
                analysis.competitiveness = 'muito competitivo';
                analysis.insights.push('Seu preço está significativamente abaixo da média da categoria. Considere aumentar para maximizar lucros.');
            } else if (product.price < analysis.categoryAverage) {
                analysis.competitiveness = 'competitivo';
                analysis.insights.push('Preço competitivo em relação à categoria.');
            } else if (product.price > analysis.categoryAverage * 1.2) {
                analysis.competitiveness = 'acima da média';
                analysis.warnings.push('Preço acima da média da categoria. Verifique se o produto justifica o valor premium.');
            } else {
                analysis.competitiveness = 'média';
            }

            // Sugestão de preço
            if (product.price < analysis.categoryAverage * 0.7) {
                analysis.recommendation = 'aumentar';
                analysis.suggestedPrice = Math.round(analysis.categoryAverage * 0.9);
                analysis.insights.push(`Sugestão: Aumentar para R$ ${analysis.suggestedPrice} para melhor posicionamento.`);
            } else if (product.price > analysis.categoryAverage * 1.3) {
                analysis.recommendation = 'reduzir';
                analysis.suggestedPrice = Math.round(analysis.categoryAverage * 1.1);
                analysis.insights.push(`Sugestão: Reduzir para R$ ${analysis.suggestedPrice} para melhor competitividade.`);
            } else {
                analysis.recommendation = 'manter';
                analysis.insights.push('Preço está bem posicionado no mercado.');
            }
        } else {
            analysis.insights.push('Primeiro produto nesta categoria. Preço será referência para futuros produtos.');
        }

        // Análise baseada em características do produto
        const descriptionLength = product.description.length;
        const hasImage = product.images && product.images.length > 0;
        const isFeatured = product.featured;

        if (!hasImage) {
            analysis.warnings.push('Produto sem imagem pode afetar vendas. Adicione uma imagem de qualidade.');
        }

        if (descriptionLength < 100) {
            analysis.warnings.push('Descrição muito curta. Descrições detalhadas aumentam conversão.');
        }

        if (isFeatured && product.price > analysis.categoryAverage * 1.2) {
            analysis.insights.push('Produto em destaque com preço premium pode ser estratégico para posicionamento de marca.');
        }

        this.priceAnalysisCache[cacheKey] = analysis;
        return analysis;
    }

    // Análise Geral do Site
    analyzeSiteImprovements() {
        if (this.improvementsCache) {
            return this.improvementsCache;
        }

        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];

        let improvements = {
            score: 0,
            maxScore: 100,
            categories: {
                produtos: { score: 0, suggestions: [] },
                preços: { score: 0, suggestions: [] },
                conversão: { score: 0, suggestions: [] },
                experiência: { score: 0, suggestions: [] }
            },
            priorityActions: []
        };

        // Análise de Produtos
        if (allProducts.length < 10) {
            improvements.categories.produtos.score = 60;
            improvements.categories.produtos.suggestions.push('Adicione mais produtos ao catálogo. Recomendado: mínimo de 15-20 produtos.');
        } else if (allProducts.length < 20) {
            improvements.categories.produtos.score = 80;
            improvements.categories.produtos.suggestions.push('Bom número de produtos. Considere adicionar mais variedade.');
        } else {
            improvements.categories.produtos.score = 100;
        }

        const productsWithoutImages = allProducts.filter(p => !p.images || p.images.length === 0).length;
        if (productsWithoutImages > 0) {
            improvements.categories.produtos.score -= 10;
            improvements.categories.produtos.suggestions.push(`${productsWithoutImages} produto(s) sem imagem. Adicione imagens para melhor conversão.`);
        }

        const featuredProducts = allProducts.filter(p => p.featured).length;
        if (featuredProducts < 3) {
            improvements.categories.produtos.suggestions.push('Adicione mais produtos em destaque (recomendado: 4-6 produtos).');
        }

        // Análise de Preços
        const priceRanges = allProducts.map(p => p.price);
        const priceVariety = new Set(priceRanges.map(p => {
            if (p < 1000) return 'econômico';
            if (p < 5000) return 'médio';
            if (p < 15000) return 'premium';
            return 'luxo';
        })).size;

        if (priceVariety >= 3) {
            improvements.categories.preços.score = 100;
            improvements.categories.preços.suggestions.push('Boa variedade de faixas de preço. Atende diferentes perfis de clientes.');
        } else {
            improvements.categories.preços.score = 70;
            improvements.categories.preços.suggestions.push('Considere adicionar produtos em diferentes faixas de preço para atrair mais clientes.');
        }

        // Análise de Conversão
        const totalOrders = allOrders.length;
        const totalUsers = allUsers.length;
        const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

        if (conversionRate > 30) {
            improvements.categories.conversão.score = 100;
        } else if (conversionRate > 15) {
            improvements.categories.conversão.score = 75;
            improvements.categories.conversão.suggestions.push('Taxa de conversão pode ser melhorada. Considere ofertas especiais ou promoções.');
        } else {
            improvements.categories.conversão.score = 50;
            improvements.categories.conversão.suggestions.push('Taxa de conversão baixa. Revise o processo de checkout e adicione incentivos.');
        }

        // Análise de Experiência
        let experienceScore = 100;
        const hasSearch = document.getElementById('searchInput') !== null;
        const hasFilters = document.getElementById('categoryFilter') !== null;

        if (!hasSearch) {
            experienceScore -= 15;
            improvements.categories.experiência.suggestions.push('Adicione busca de produtos para melhorar navegação.');
        }

        if (!hasFilters) {
            experienceScore -= 15;
            improvements.categories.experiência.suggestions.push('Adicione filtros de produtos (categoria, preço) para facilitar busca.');
        }

        improvements.categories.experiência.score = experienceScore;

        // Calcular score geral
        improvements.score = Math.round(
            (improvements.categories.produtos.score * 0.3 +
             improvements.categories.preços.score * 0.2 +
             improvements.categories.conversão.score * 0.3 +
             improvements.categories.experiência.score * 0.2)
        );

        // Ações prioritárias
        improvements.priorityActions = [
            ...improvements.categories.produtos.suggestions.slice(0, 2),
            ...improvements.categories.preços.suggestions.slice(0, 1),
            ...improvements.categories.conversão.suggestions.slice(0, 1),
            ...improvements.categories.experiência.suggestions.slice(0, 1)
        ].slice(0, 5);

        this.improvementsCache = improvements;
        return improvements;
    }

    // Análise de Produto Específico
    analyzeProduct(product) {
        const priceAnalysis = this.analyzePrice(product);
        
        return {
            price: priceAnalysis,
            completeness: this.analyzeProductCompleteness(product),
            recommendations: this.generateProductRecommendations(product, priceAnalysis)
        };
    }

    analyzeProductCompleteness(product) {
        let score = 0;
        const issues = [];

        if (product.name && product.name.length >= 5) score += 20;
        else issues.push('Nome muito curto (mínimo 5 caracteres recomendado)');

        if (product.description && product.description.length >= 100) score += 30;
        else issues.push('Descrição muito curta (mínimo 100 caracteres recomendado)');

        if (product.images && product.images.length > 0) score += 30;
        else issues.push('Adicione pelo menos uma imagem');

        if (product.category) score += 10;
        else issues.push('Categoria não definida');

        if (product.price > 0) score += 10;
        else issues.push('Preço inválido');

        return {
            score,
            issues,
            isComplete: score === 100
        };
    }

    generateProductRecommendations(product, priceAnalysis) {
        const recommendations = [];

        if (!product.images || product.images.length === 0) {
            recommendations.push({
                type: 'critical',
                title: 'Adicionar Imagem',
                description: 'Produtos com imagens têm 3x mais chances de venda.',
                action: 'Adicione uma imagem de alta qualidade do produto.'
            });
        }

        if (product.description.length < 150) {
            recommendations.push({
                type: 'important',
                title: 'Melhorar Descrição',
                description: 'Descrições detalhadas aumentam a confiança do cliente.',
                action: 'Inclua dimensões, materiais, garantia e características especiais.'
            });
        }

        if (priceAnalysis.recommendation === 'aumentar' && priceAnalysis.suggestedPrice > product.price) {
            recommendations.push({
                type: 'suggestion',
                title: 'Ajuste de Preço',
                description: `Preço abaixo da média da categoria (R$ ${priceAnalysis.categoryAverage.toFixed(2)}).`,
                action: `Considere aumentar para R$ ${priceAnalysis.suggestedPrice} para melhor posicionamento.`
            });
        }

        if (!product.featured && priceAnalysis.competitiveness === 'muito competitivo') {
            recommendations.push({
                type: 'suggestion',
                title: 'Produto em Destaque',
                description: 'Produto com preço competitivo pode atrair mais clientes.',
                action: 'Marque como produto em destaque para aumentar visibilidade.'
            });
        }

        return recommendations;
    }

    // Limpar cache
    clearCache() {
        this.priceAnalysisCache = {};
        this.improvementsCache = null;
    }
}

// Instância global
const aiAssistant = new AIAssistant();

// Exportar para uso global
if (typeof globalThis !== 'undefined') {
    globalThis.aiAssistant = aiAssistant;
}

