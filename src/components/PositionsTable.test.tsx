import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PositionsTable } from './PositionsTable';

const sample = {
  updated_at: '2025-08-26T13:32:47Z',
  base_currency: 'USDC',
  total_quote_invested: '100',
  positions: [
    { symbol: 'BTCUSDC', open_quantity: '0.001', total_cost: '50' },
    { symbol: 'ETHUSDC', open_quantity: '0.01', total_cost: '50' },
  ],
};

describe('PositionsTable', () => {
  it('renders positions', () => {
    render(<PositionsTable data={sample} />);
    expect(screen.getByText('BTCUSDC')).toBeInTheDocument();
    expect(screen.getByText('ETHUSDC')).toBeInTheDocument();
  });
});

