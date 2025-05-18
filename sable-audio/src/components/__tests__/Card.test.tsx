import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <Card style={{ marginTop: 20 }} testID="card">
        <Text>Test Content</Text>
      </Card>
    );

    const card = getByTestId('card');
    expect(card.props.style).toContainEqual({ marginTop: 20 });
  });
}); 