import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("toggles dark mode and density from the app controls", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Dark" }));
    await user.click(screen.getByRole("button", { name: "Comfortable" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.density).toBe("comfortable");
  });

  it("opens the command palette with Ctrl+K and executes a filter command", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard("{Control>}k{/Control}");

    expect(screen.getByRole("dialog", { name: /command palette/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/command search/i), "critical");
    await user.click(screen.getByRole("button", { name: /show critical risks/i }));

    expect(screen.getByText("Payments Gateway")).toBeInTheDocument();
    expect(screen.queryByText("Warehouse Forecasting")).not.toBeInTheDocument();
  });

  it("reflects reduced-motion system preference on the shell", async () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    const { container } = render(<App />);

    await waitFor(() => expect(container.querySelector(".app-shell")).toHaveAttribute("data-motion", "reduced"));
  });
});
