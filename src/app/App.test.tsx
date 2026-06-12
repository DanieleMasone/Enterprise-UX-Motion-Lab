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
    expect(window.localStorage.getItem("enterprise-ux-motion-lab:theme")).toBe("dark");
    expect(window.localStorage.getItem("enterprise-ux-motion-lab:density")).toBe("comfortable");
  });

  it("hydrates theme and density from stored preferences", async () => {
    window.localStorage.setItem("enterprise-ux-motion-lab:theme", "dark");
    window.localStorage.setItem("enterprise-ux-motion-lab:density", "comfortable");

    render(<App />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(document.documentElement.dataset.density).toBe("comfortable");
    });
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

  it("opens with Cmd+K and closes the command palette with Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByRole("dialog", { name: /command palette/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /command palette/i })).not.toBeInTheDocument());
  });

  it("runs command actions for clearing and focusing filters", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/search risks/i), "payments");
    expect(screen.queryByText("Identity Provisioning")).not.toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    await user.type(screen.getByLabelText(/command search/i), "clear");
    await user.keyboard("{Enter}");
    expect(screen.getByText("Identity Provisioning")).toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    await user.type(screen.getByLabelText(/command search/i), "focus");
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText(/search risks/i)).toHaveFocus();
  });

  it("runs command actions for data state and detail disclosure", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /hide/i }));
    await waitFor(() => expect(screen.queryByText(/shift 18% of traffic/i)).not.toBeInTheDocument());

    await user.keyboard("{Control>}k{/Control}");
    await user.type(screen.getByLabelText(/command search/i), "expand");
    await user.keyboard("{Enter}");
    expect(screen.getByText(/shift 18% of traffic/i)).toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    await user.type(screen.getByLabelText(/command search/i), "cycle");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status", { name: /loading operational risk data/i })).toBeInTheDocument();
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
