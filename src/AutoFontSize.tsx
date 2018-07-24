import * as React from 'react';
import { findDOMNode } from 'react-dom';

const lineHeightFunc = require('line-height');

interface IAutoFontSizeProps {
    text: string;
    textSize: number;
    minTextSize?: number;
    textSizeStep?: number;
    targetLines?: number;
}

interface IAutoFontSizeStates {
    currentTextSize: number;
    currentParentWidth: number;
}

class AutoFontSize extends React.Component<
    IAutoFontSizeProps,
    IAutoFontSizeStates
    > {
    public static defaultProps: Partial<IAutoFontSizeProps> = {
        textSizeStep: 2,
        targetLines: 1,
        minTextSize: 2
    };

    private textContainer: HTMLParagraphElement | null = null;

    constructor(props: IAutoFontSizeProps) {
        super(props);
        this.state = {
            currentTextSize: props.textSize,
            currentParentWidth: 0
        };
    }

    public render() {
        const { text } = this.props;
        const {
            currentTextSize,
            currentParentWidth
        } = this.state;

        const cacledStyle: React.CSSProperties = {
            fontSize: currentTextSize,
            width: currentParentWidth
        };

        return (
            <p ref={_ => (this.textContainer = _)} style={cacledStyle}>
                {text}
            </p>
        );
    }

    public componentDidUpdate() {
        const container = this._getContainer();
        if (container) {
            const { targetLines, textSize, textSizeStep, minTextSize } = this.props;

            // Get line height data since container width is now fixed
            const lineHeight = lineHeightFunc(container);
            const containerHeight = container.clientHeight;
            const currentTextLines = Math.floor(containerHeight / lineHeight);
            const { currentTextSize } = this.state;
            if (currentTextLines > targetLines &&
                currentTextSize > minTextSize) {
                // Need shrink font size
                const ratio = targetLines / currentTextLines;
                const calcTextSize = Math.ceil(currentTextSize * ratio);
                const stepAdjust = Math.floor((textSize - calcTextSize) % textSizeStep);
                const finalTextSize = calcTextSize - stepAdjust;
                this.setState({ currentTextSize: finalTextSize >= minTextSize ? finalTextSize : minTextSize });
            }
        }
    }

    public componentDidMount() {
        const container = this._getContainer();
        if (container) {
            // set width data from parent
            const containerParent = container.parentElement;
            if (containerParent) {
                const parentWidth = containerParent.clientWidth;
                this.setState({
                    currentParentWidth: parentWidth
                });
            }
        }
    }

    private _getContainer() {
        if (this.textContainer) {
            const container = findDOMNode(this.textContainer) as HTMLParagraphElement;
            if (container) {
                return container;
            }
        }

        return null;
    }
}

export { AutoFontSize };
