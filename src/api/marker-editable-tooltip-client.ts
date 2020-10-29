import axios from 'axios';

export interface MarkerEditableTooltipDto {
    id: string;
    x: number;
    y: number;
    content: string | null;
    isDeleted: boolean;
}

const baseServerUrl = 'http://localhost:3001';

export async function getAllTooltips(): Promise<MarkerEditableTooltipDto[]> {
    const response = await axios.get(`${baseServerUrl}/marker-editable-tooltips/`);
    return response.data;
}

export async function createOrUpdateTooltip(tooltip: MarkerEditableTooltipDto): Promise<void> {
    await axios.put(`${baseServerUrl}/marker-editable-tooltips/${tooltip.id}`, tooltip);
}

export async function deleteTooltip(tooltip: MarkerEditableTooltipDto): Promise<void> {
    await createOrUpdateTooltip({ ...tooltip, isDeleted: true });
}