import React from 'react';
import styled from 'styled-components';
import { MarkerEditableTooltip } from './marker-editable-tooltip';
import { v4 as uuid } from 'uuid';
import { MarkerEditableTooltipDto } from '../api/marker-editable-tooltip-client';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

interface TooltipMap {
  [id: string]: MarkerEditableTooltipDto;
}

export interface MarkerEditableTooltipContainerProps {
  tooltipMap: TooltipMap;
}

export class MarkerEditableTooltipContainer extends React.Component<
  {},
  MarkerEditableTooltipContainerProps
> {
  constructor(props: MarkerEditableTooltipContainerProps) {
    super(props);
    this.state = { tooltipMap: {} };
  }

  updateTooltipState = (tooltip: MarkerEditableTooltipDto) => {
    this.setState({
      tooltipMap: { ...this.state.tooltipMap, [tooltip.id]: tooltip },
    });
  };

  handleClick = (event: React.MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    const id = uuid();
    this.updateTooltipState({ id, x, y, content: null, isDeleted: false });
  };

  render() {
    return (
      <Container aria-label="tooltips" onClick={this.handleClick}>
        {Object.entries(this.state.tooltipMap).map(([id, tooltip]) => (
          <MarkerEditableTooltip
            key={id}
            {...tooltip}
            onContentUpdated={(content: string) => {
              this.updateTooltipState({ ...tooltip, content });
            }}
            onDelete={() => {
              this.setState({
                tooltipMap: Object.fromEntries(
                  Object.entries(this.state.tooltipMap).filter(
                    ([tooltipId, _]) => tooltipId !== id
                  )
                ),
              });
            }}
          />
        ))}
      </Container>
    );
  }
}
