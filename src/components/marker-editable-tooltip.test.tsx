import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import { MarkerEditableTooltip } from './marker-editable-tooltip';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);
describe('MarkerEditableTooltip', () => {
  describe('when user clicks', () => {
    const props = {
      id: 'someId',
      x: 10,
      y: 20,
      onContentUpdated: (content: string): void => {},
    };

    test('should show tooltip marker where the user has clicked', () => {
      render(<MarkerEditableTooltip {...props} />);

      const markerEditableTooltip = screen.getByRole('tooltip');
      const style = window.getComputedStyle(markerEditableTooltip);
      expect(style.left).toBe('10px');
      expect(style.top).toBe('20px');
    });

    describe('and user hovers over marker', () => {
      /* found open [github issue](https://github.com/testing-library/jest-dom/issues/209)  where `toBeVisible` is not working as expected so disabled test
       */
      test.skip('should show empty tooltip', async () => {
        render(<MarkerEditableTooltip {...props} />);

        userEvent.hover(screen.getByRole('tooltip'));

        await waitFor(() => {
          expect(screen.getByTestId('textarea')).toBeVisible();
          expect(screen.getByTestId('textarea')).toHaveValue('');
        });
      });

      describe('and user enters text in textbox', () => {
        test('should show tooltip with entered text', () => {
          const { getByTestId } = render(<MarkerEditableTooltip {...props} />);
          userEvent.hover(getByTestId('textarea'));

          userEvent.type(getByTestId('textarea'), 'Hello World');

          expect(getByTestId('textarea')).toHaveValue('Hello World');
        });

        test('should fire `onContentUpdated` with entered text when focus is lost', () => {
          const spyOnChange = jest.fn();
          const propsWithSpyOnChange = {
            ...props,
            onContentUpdated: spyOnChange,
          };
          const { getByTestId } = render(
            <MarkerEditableTooltip {...propsWithSpyOnChange} />
          );

          userEvent.type(getByTestId('textarea'), 'Hello World');
          fireEvent.blur(getByTestId('textarea'));

          expect(spyOnChange).toBeCalled();
        });
      });
    });
  });

  describe('when an existing tooltip is clicked', () => {
    const props = {
      id: 'someId',
      x: 10,
      y: 20,
      onContentUpdated: (content: string): void => {},
    };
    describe('and existing tooltip is empty', () => {
      test('should show tooltip with no text', () => {
        const { getByTestId } = render(<MarkerEditableTooltip {...props} />);

        expect(getByTestId('textarea')).toHaveValue('');
      });
    });

    describe('and existing tooltip is not empty', () => {
      const propsWithContent = { ...props, content: 'existing text' };
      test('should show with existing text', () => {
        const { getByTestId } = render(
          <MarkerEditableTooltip {...propsWithContent} />
        );

        expect(getByTestId('textarea')).toHaveValue('existing text');
      });

      describe('when user enters additional text', () => {
        test('should show with existing and additional text', () => {
          const { getByTestId } = render(
            <MarkerEditableTooltip {...propsWithContent} />
          );

          userEvent.type(getByTestId('textarea'), ' Hello World');

          expect(getByTestId('textarea')).toHaveValue(
            'existing text Hello World'
          );
        });

        test('should fire `onContentUpdated` with existing and additional text when focus is lost', () => {
          const spyOnChange = jest.fn();
          const propsWithContentSpyOnChange = {
            ...propsWithContent,
            onContentUpdated: spyOnChange,
          };
          const { getByTestId } = render(
            <MarkerEditableTooltip {...propsWithContentSpyOnChange} />
          );

          userEvent.type(getByTestId('textarea'), ' Hello World');
          fireEvent.blur(getByTestId('textarea'));

          expect(spyOnChange).toBeCalledWith('existing text Hello World');
        });
      });
    });
  });
});
