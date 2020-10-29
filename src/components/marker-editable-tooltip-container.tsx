import React from 'react';
import styled from 'styled-components';
import { MarkerEditableTooltip } from './marker-editable-tooltip';
import { v4 as uuid } from 'uuid';
import {
  createOrUpdateTooltip,
  deleteTooltip,
  getAllTooltips,
  MarkerEditableTooltipDto,
} from '../api/marker-editable-tooltip-client';
import { makeCancelable } from '../utils/makeCancelable';

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
  cleanupTasks: Array<() => void> = [];
  constructor(props: MarkerEditableTooltipContainerProps) {
    super(props);
    this.state = { tooltipMap: {} };
  }

  componentWillUnmount() {
    for (const cleanupTask of this.cleanupTasks) {
      cleanupTask();
    }
  }

  async componentDidMount() {
    const getAllTooltipsCancelable = makeCancelable(getAllTooltips());
    this.cleanupTasks.push(() => getAllTooltipsCancelable.cancel());
    try {
      const tooltips = await getAllTooltipsCancelable.promise;

      const tooltipMap = tooltips
        .filter((_: { isDeleted: any }) => !_.isDeleted)
        .reduce((tooltipMap: TooltipMap, tooltip: MarkerEditableTooltipDto) => {
          tooltipMap[tooltip.id] = tooltip;
          return tooltipMap;
        }, {});

      this.setState({
        tooltipMap: tooltipMap,
      });
    } catch (error) {
      // TODO consider better error handling like a error boundary of some sort
      console.error(error);
    }
  }

  updateTooltipState = async (tooltip: MarkerEditableTooltipDto) => {
    const createOrUpdateTooltipCancelable = makeCancelable(
      createOrUpdateTooltip(tooltip)
    );
    this.cleanupTasks.push(() => createOrUpdateTooltipCancelable.cancel());
    await createOrUpdateTooltipCancelable.promise;
    this.setState({
      tooltipMap: { ...this.state.tooltipMap, [tooltip.id]: tooltip },
    });
  };

  handleClick = async (event: React.MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    const id = uuid();
    await this.updateTooltipState({
      id,
      x,
      y,
      content: null,
      isDeleted: false,
    });
  };

  render() {
    return (
      <Container aria-label="tooltips" onClick={this.handleClick}>
        {Object.entries(this.state.tooltipMap).map(([id, tooltip]) => (
          <MarkerEditableTooltip
            key={id}
            {...tooltip}
            onContentUpdated={async (content: string) => {
              await this.updateTooltipState({ ...tooltip, content });
            }}
            onDelete={async () => {
              const deleteTooltipCancelable = makeCancelable(
                deleteTooltip(tooltip)
              );
              this.cleanupTasks.push(() => deleteTooltipCancelable.cancel());
              await deleteTooltipCancelable.promise;
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
