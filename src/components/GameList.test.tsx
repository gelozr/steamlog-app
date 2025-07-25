import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from "react-router-dom"
import GameList from './GameList'
import { vi } from 'vitest'

// mock echo-react
vi.mock('@laravel/echo-react', () => ({
  useEchoPublic: () => { },
  configureEcho: () => { },
}))

describe('GameList component', () => {
  it('renders the search input', () => {
    render(
      <MemoryRouter>
        <GameList />
      </MemoryRouter>
    )
    const input = screen.getByPlaceholderText("Search by name...")
    expect(input).toBeInTheDocument()
  })

  it("renders a table", () => {
    render(
      <MemoryRouter>
        <GameList />
      </MemoryRouter>
    )

    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Genre")).toBeInTheDocument()
  })
})
