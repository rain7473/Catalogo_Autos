import type { ReactNode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminDashboard from '../../src/components/AdminDashboard';
import { vehiculos } from '../../src/vehiculos';

vi.mock('recharts', () => {
  const Container = ({ children }: { children?: ReactNode }) => <div>{children}</div>;

  return {
    Bar: () => null,
    BarChart: Container,
    CartesianGrid: () => null,
    Cell: () => null,
    Pie: Container,
    PieChart: Container,
    ResponsiveContainer: Container,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
  };
});

describe('AdminDashboard', () => {
  it('muestra el inventario inicial', () => {
    render(<AdminDashboard initialVehicles={vehiculos} />);

    expect(screen.getByRole('heading', { name: /inventario autos la fe/i })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Toyota Hilux/i })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Ford Escape/i })).toBeInTheDocument();
  });

  it('requiere marca y modelo antes de guardar un nuevo vehiculo', () => {
    render(<AdminDashboard initialVehicles={vehiculos} />);

    fireEvent.click(screen.getByRole('button', { name: /nuevo veh.culo/i }));
    const saveButton = screen.getByRole('button', { name: /guardar veh.culo/i });

    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Mazda' } });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'CX-5' } });
    fireEvent.change(screen.getByLabelText('Precio'), { target: { value: '34000' } });
    fireEvent.click(saveButton);

    expect(screen.getByRole('row', { name: /Mazda CX-5/i })).toHaveTextContent('$34,000');
  });

  it('alterna el estado de un vehiculo desde la tabla', () => {
    render(<AdminDashboard initialVehicles={vehiculos} />);

    const row = screen.getByRole('row', { name: /Toyota Hilux/i });
    fireEvent.click(within(row).getByRole('button', { name: /vender/i }));

    expect(screen.getByRole('row', { name: /Toyota Hilux/i })).toHaveTextContent(/vendido/i);
  });
});
