import React from 'react';
import styled /* , { keyframes }*/ from 'styled-components';

export interface MarkerEditableTooltipProps {
  id: string;
  x: number;
  y: number;
  content: string | null;
  onContentUpdated: (content: string) => void;
  onDelete: () => void;
}

const Textarea = styled.textarea`
  background: lightgray;
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  border-radius: 5px;
`;

const Marker = styled.div`
  border-radius: 5px;
  width: 20px;
  height: 20px;
  background: lightgray;
`;

const Container = styled.div<{ x: number; y: number }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
`;

const TextareaContainer = styled.div`
  margin-left: 5px;
  display: flex;
  flex-direction: row;
  visibility: hidden;
  transition: visibility 1s linear;
  ${Container}:hover & {
    visibility: visible;
  }
`;

const DeleteButton = styled.button`
  margin-left: 5px;
  border-radius: 5px;
  background: lightgray;
  height: 35px;
  width: 35px;
  border: none;
  &:hover {
    background: gray;
  }
`;

export class MarkerEditableTooltip extends React.Component<
  MarkerEditableTooltipProps,
  {
    currentContent: string | null;
    onContentChanged: (content: string) => void;
  }
> {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  constructor(props: MarkerEditableTooltipProps) {
    super(props);
    this.state = {
      currentContent: props.content,
      onContentChanged: props.onContentUpdated,
    };
    this.textareaRef = React.createRef();
  }

  handleTextareaChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    this.setState({ currentContent: event.target.value });
  };

  handleTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (
      this.state.currentContent &&
      this.state.currentContent !== this.props.content
    ) {
      this.state.onContentChanged(this.state.currentContent);
    }
  };

  handleContainerClick = (event: React.MouseEvent) => {
    if (this.textareaRef && this.textareaRef.current) {
      this.textareaRef.current.focus();
    }
    /* prevent other tooltips from being within the editting area
     */
    event.stopPropagation();
  };

  handleDeleteButtonClick = (event: React.MouseEvent) => {
    this.props.onDelete();
    /* prevent other tooltips from being within the editting area
     */
    event.stopPropagation();
  };

  render() {
    const { x, y } = this.props;
    return (
      <Container role="tooltip" x={x} y={y} onClick={this.handleContainerClick}>
        <Marker aria-label="marker" />
        <TextareaContainer>
          <Textarea
            data-testid="textarea"
            ref={this.textareaRef}
            rows={7}
            cols={33}
            onChange={this.handleTextareaChange}
            onBlur={this.handleTextareaBlur}
            value={
              (this.state.currentContent && this.state.currentContent) ||
              undefined
            }
          />
          <DeleteButton onClick={this.handleDeleteButtonClick}>
            Del
          </DeleteButton>
        </TextareaContainer>
      </Container>
    );
  }
}
