import axios, { type AxiosResponse, type GenericAbortSignal } from "axios"
import type { Game } from "@/types/game"

const BASE_URL = "http://127.0.0.1:8000/api"

export async function fetchGames(params?: any, singal?: GenericAbortSignal): Promise<Game[]> {
    const response = await axios.get(`${BASE_URL}/games`, { params, signal: singal })
    return response.data.data
}

export async function fetchGameById(id: number | string): Promise<Game> {
    const response = await axios.get(`${BASE_URL}/games/${id}`)
    return response.data.data
}

export async function fetchGenres(): Promise<string[]> {
    const response = await axios.get(`${BASE_URL}/games/genres`)
    return response.data.data
}

export async function createGame(formData: Game): Promise<AxiosResponse> {
    try {
        return await axios.post(`${BASE_URL}/games`, formData);
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        }
        throw error;
    }
}

export async function updateGame(id: number | string, formData: Game): Promise<AxiosResponse> {
    try {
        return await axios.patch(`${BASE_URL}/games/${id}`, formData)
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        }
        throw error;
    }
}

export async function deleteGame(id: number | string): Promise<AxiosResponse> {
    try {
        return await axios.delete(`${BASE_URL}/games/${id}`)
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        }
        throw error;
    }
}
