import { Injectable } from "@angular/core";
import { GuiLocalization } from "@generic-ui/ngx-grid";

@Injectable({
    providedIn: 'root'
})

export class GridLocalization {
    constructor() { 

    }

    public getConfig(): GuiLocalization {
        return {
            'translation': {
                "sourceEmpty": "Nenhum registro encontrado.",
                "pagingItemsPerPage": "Itens por página:",
                "pagingOf": "de",
                "pagingNextPage": ">",
                "pagingPrevPage": "<",
                "pagingNoItems": "Não há itens.",
                "infoPanelShowing": "Mostrando",
                "infoPanelItems": "itens",
                "infoPanelOutOf": "fora de",
                "infoPanelThemeMangerTooltipText": "Gerenciador de temas",
                "infoPanelColumnManagerTooltipText": "Gerenciador de colunas",
                "infoPanelInfoTooltipText": "info",
                "themeManagerModalTitle": "Gerenciador de temas",
                "themeManagerModalTheme": "Tema:",
                "themeManagerModalRowColoring": "Coloração de linha:",
                "themeManagerModalVerticalGrid": "Grade vertical",
                "themeManagerModalHorizontalGrid": "Grade horizontal",
                "columnManagerModalTitle": "Gerenciador de colunas",
                "headerMenuMainTab": "Menu",
                "headerMenuMainTabColumnSort": "Ordernar coluna",
                "headerMenuMainTabHideColumn": "Esconder coluna",
                "headerMenuMainTabHighlightColumn": "Destaque",
                "headerMenuMainTabMoveLeft": "Para a esquerda",
                "headerMenuMainTabMoveRight": "Para a direita",
                "headerMenuMainTabColumnSortAscending": "Ascendente",
                "headerMenuMainTabColumnSortDescending": "Descendente",
                "headerMenuMainTabColumnSortNone": "Nenhum",
                "headerMenuFilterTab": "Filtrar",
                "headerMenuColumnsTab": "Colunas",
                "summariesCount": "Contar",
                "summariesDist": "Distinto",
                "summariesSum": "Sum",
                "summariesAvg": "Avg",
                "summariesMin": "Min",
                "summariesMax": "Max",
                "summariesMed": "Med",
                "summariesTruthy": "Truthy",
                "summariesFalsy": "Falsy",
                "summariesDistinctValuesTooltip": "Valores distintos",
                "summariesAverageTooltip": "Média",
                "summariesMinTooltip": "Min",
                "summariesMaxTooltip": "Max",
                "summariesMedTooltip": "Median",
                "summariesCountTooltip": "Number of items in the grid"
            }
        }
    }
}