import cx from "classnames";
import {isEqual} from "lodash";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import {compose, setDisplayName} from "recompose";
import * as ReactTourActions from "state/reactTour/actions";
import * as Selectors from "state/reactTour/selectors";
import {IState as RectTourState} from "state/reactTour/types";
import {getElementBySelector, getObjectFromClientRect, getRectOfElementBySelector} from "./helpers";
import {STORE_KEY} from "./ReactTourProvider";
import * as styles from "./styles.scss";
import {
  AutomatedEvent,
  AutomatedEventType,
  ClickAutomatedEvent,
  FakeClickAutomatedEvent,
  PerformHandlerAutomatedEvent,
  RemoveEventAutomatedEvent,
  ScrollAutomatedEvent,
  ScrollToSide,
  TypingAutomatedEvent,
  WaitAutomatedEvent,
} from "./types";

const setNativeValue = (element: any, value: any) => {
  const valueSetter = (Object as any).getOwnPropertyDescriptor(element, "value").set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = (Object as any).getOwnPropertyDescriptor(prototype, "value").set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
};

const easeInOutQuad = (currentTime: number, startValue: number, changeInValue: number, duration: number) => {
  currentTime /= duration / 2;
  if (currentTime < 1) {
    return (changeInValue / 2) * currentTime * currentTime + startValue;
  }
  currentTime--;
  return (-changeInValue / 2) * (currentTime * (currentTime - 2) - 1) + startValue;
};

/* Outer props
-------------------------------------------------------------------------*/

interface IOuterProps {
  automatedSteps: AutomatedEvent[];
  onAutomationFinished: () => void;
  onAutomationInterrupted: () => void;
}

/* Connect
-------------------------------------------------------------------------*/

interface IReduxProps {
  eventsKeys: Set<string>;
}

const mapStateToProps = (state: RectTourState, props: IOuterProps): IReduxProps => {
  const eventsKeys = Selectors.getEventKeys(state);

  return {
    eventsKeys,
  };
};

const withConnect = connect(
  mapStateToProps,
  undefined,
  undefined,
  {
    storeKey: STORE_KEY,
  },
);

/* Template
-------------------------------------------------------------------------*/

interface ITemplateState {
  currentIdx: number;
  isCursorVisible: boolean;
  isClickVisible: boolean;
  cachedRect?: ClientRect;
  waitEventTryAgainCounter: number;
}

type ITemplateProps = IOuterProps & IReduxProps & DispatchProp<any>;

class Template extends React.PureComponent<ITemplateProps, ITemplateState> {
  // Properties

  private timeouts: any[] = [];

  public state: ITemplateState = {
    currentIdx: 0,
    isCursorVisible: false,
    isClickVisible: false,
    waitEventTryAgainCounter: 0,
  };

  // Lifecycle

  public componentDidMount() {
    this.sleep(600).then(() => {
      this.handleNext();
    });
  }

  public componentWillUnmount() {
    this.clearTimeouts();
  }

  public componentDidUpdate(prevProps: ITemplateProps, prevState: ITemplateState) {
    const {automatedSteps} = this.props;
    const {currentIdx, cachedRect} = this.state;

    const currentStep = automatedSteps[currentIdx];
    if (prevState.currentIdx !== currentIdx) {
      this.handleNext();
    }

    const rect = getRectOfElementBySelector(currentStep.target);
    if (!rect) {
      return;
    }
    const rectObj = getObjectFromClientRect(rect);
    if (!cachedRect) {
      this.setState({cachedRect: rect});
      return;
    }
    const cachedRectObj = getObjectFromClientRect(cachedRect);

    if (!isEqual(rectObj, cachedRectObj)) {
      this.setState({cachedRect: rect});
    }
  }

  public render() {
    const {automatedSteps, onAutomationInterrupted} = this.props;
    const {currentIdx, isCursorVisible, isClickVisible, cachedRect} = this.state;
    const currentStep = automatedSteps[currentIdx];
    if (!currentStep) {
      return null;
    }
    let rect = getRectOfElementBySelector(currentStep.target);
    if (!rect) {
      rect = cachedRect;
    }
    if (!rect) {
      return null;
    }

    const cursorWidth = 35;
    const cursorHeight = 35;

    const cursorPositionStyles: React.CSSProperties = {
      width: cursorWidth,
      height: cursorHeight,
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2 - cursorWidth / 2 + 4,
    };

    const clickPositionStyles: React.CSSProperties = {
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    };

    return (
      <div className={styles.AutomatedGuide} onClick={onAutomationInterrupted}>
        {isClickVisible && <div className={styles.clickEffect} style={clickPositionStyles} />}
        <div className={cx(styles.guideCursor, {[styles.isVisible]: isCursorVisible})} style={cursorPositionStyles}>
          <svg xmlns="http://www.w3.org/2000/svg" width="33" height="36">
            <defs>
              <filter filterUnits="userSpaceOnUse" id="a" x="0" y="0" width="33" height="36">
                <feOffset in="SourceAlpha" dy="2" />
                <feGaussianBlur result="blurOut" stdDeviation="1.414" />
                <feFlood result="floodOut" />
                <feComposite operator="atop" in="floodOut" in2="blurOut" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope=".5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              fill="#FFF"
              d="M29 22v4h-4 2v6h-4v-2h-2v2H11v-4H9v-2h2-4v-2H5v-4H3v-2H1v-4h2v-2h4v2h2V2h2V0h4v2h2v6h8v2h4v2h2v10h-2z"
              filter="url(#a)"
            />
            <path d="M29 22V12h2v10h-2zm-10-4h2v8h-2v-8zm-4 0h2v8h-2v-8zm12-4h-2v-4h4v2h-2v2zm-4 0h-2v-4h-4v4h-2V2h2v6h8v2h-2v4zM9 20v-4H7v-2h2V2h2v18H9zm-4 0H3v-2h2v2zm2 4H5v-4h2v4zm2 2H7v-2h2v2zm2 2H9v-2h2v2zm2 2h8v2H11v-4h2v2zm10-2v2h-2v-2h2zm2-2h2v6h-4v-2h2v-4zm-2-8h2v8h-2v-8zm6 4v4h-2v-4h2zM1 18v-4h2v4H1zm2-6h4v2H3v-2zm8-12h4v2h-4V0z" />
          </svg>
        </div>
      </div>
    );
  }

  // Events handlers

  private executeEvent(event: AutomatedEvent) {
    if (event === undefined) {
      return;
    }

    switch (event.type) {
      case AutomatedEventType.CLICK:
        this.simulateClickEvent(event);
        break;
      case AutomatedEventType.FAKE_CLICK:
        this.simulateFakeClickEvent(event);
        break;
      case AutomatedEventType.TEXT_INPUT:
        this.simulateTypingEvent(event);
        break;
      case AutomatedEventType.WAIT:
        this.setState({waitEventTryAgainCounter: 0});
        this.simulateWaitEvent(event);
        break;
      case AutomatedEventType.SCROLL:
        this.simulateScrollEvent(event);
        break;
      case AutomatedEventType.REMOVE_EVENT_KEY:
        this.simulateRemoveKeyEvent(event);
        break;
      case AutomatedEventType.PERFORM_HANDLER:
        this.simulatePerformHandlerEvent(event);
        break;
      default:
        return;
    }
  }

  private async simulateHoverEvent(target: any, handler?: () => void) {
    this.toggleCursor(true);

    return this.sleep(200).then(() => {
      if (handler) {
        handler();
      } else {
        target.classList.add("hover");
      }
    });
  }

  private removeHoverEvent(target: any) {
    target.classList.remove("hover");
    this.toggleCursor(false);
  }

  private simulateClickEvent(event: ClickAutomatedEvent) {
    const target: any = getElementBySelector(event.target);
    const hoverTargetSelector = event.hoverTarget !== undefined ? event.hoverTarget : event.target;
    const hoverTarget: any = getElementBySelector(hoverTargetSelector);

    this.simulateHoverEvent(hoverTarget)
      .then(() => this.sleep(800))
      .then(() => {
        this.setState({isClickVisible: true});
        target.focus();
        target.click();
        return this.sleep(600);
      })
      .then(() => {
        this.setState({isClickVisible: false});
        this.removeHoverEvent(hoverTarget);
        return this.sleep(300);
      })
      .then(() => {
        this.setState({cachedRect: undefined});
        this.stepExecutionFinished();
      });
  }

  private simulateWaitEvent(event: WaitAutomatedEvent) {
    const {eventsKeys, onAutomationInterrupted} = this.props;
    const {waitEventTryAgainCounter} = this.state;
    const waitingFor = event.waitFor;

    if (eventsKeys.has(waitingFor)) {
      this.stepExecutionFinished();
    } else {
      const maxTryAgainCount = 60;
      if (waitEventTryAgainCounter > maxTryAgainCount) {
        onAutomationInterrupted();
        return;
      }
      this.setState({waitEventTryAgainCounter: waitEventTryAgainCounter + 1});
      this.sleep(1000).then(() => {
        this.simulateWaitEvent(event);
      });
    }
  }

  private simulateFakeClickEvent(event: FakeClickAutomatedEvent) {
    const hoverTarget: any = getElementBySelector(event.target);
    const handler = event.handler !== undefined ? event.handler : () => {};

    this.simulateHoverEvent(hoverTarget, event.hoverHandler)
      .then(() => this.sleep(800))
      .then(() => {
        this.setState({isClickVisible: true});
        handler();
        return this.sleep(600);
      })
      .then(() => {
        this.setState({isClickVisible: false});
        return this.sleep(300);
      })
      .then(() => {
        this.setState({cachedRect: undefined});
        this.stepExecutionFinished();
      });
  }

  private simulateRemoveKeyEvent(event: RemoveEventAutomatedEvent) {
    const {dispatch} = this.props;
    const {keyToRemove} = event;
    dispatch(ReactTourActions.removeEvent({eventKey: keyToRemove}));
    this.stepExecutionFinished();
  }

  private simulateTypingEvent(event: TypingAutomatedEvent) {
    const target: any = getElementBySelector(event.target);

    this.simulateFocusEvent(event).then(() => {
      const inputText = event.input;
      if (inputText.length === 0) {
        this.stepExecutionFinished();
        return;
      }

      setNativeValue(target, "");
      target.dispatchEvent(new Event("input", {bubbles: true}));
      const characters = inputText.split("");
      characters
        .reduce((result, character) => {
          return result.then(() => {
            setNativeValue(target, `${target.value}${character}`);
            return this.sleep(100);
          });
        }, this.sleep(100))
        .then(() => {
          target.dispatchEvent(new Event("input", {bubbles: true}));
          return this.sleep(1500);
        })
        .then(() => {
          target.blur();
          this.stepExecutionFinished();
        });
    });
  }

  private simulateScrollEvent(event: ScrollAutomatedEvent) {
    const list = getElementBySelector(event.target);

    if (!list) {
      this.stepExecutionFinished();
      return;
    }

    if (event.scrollToTarget) {
      this.scrollToTarget(list, event.scrollToTarget);
    } else if (event.scrollToSide) {
      this.scrollToSide(list, event.scrollToSide);
    }
  }

  private scrollToTarget(list: HTMLElement, target: string) {
    const scrollToTarget = getElementBySelector(target);

    if (!scrollToTarget) {
      this.stepExecutionFinished();
      return;
    }

    const itemTopOffset = scrollToTarget.offsetTop - list.offsetTop;
    const listHeight = list.getBoundingClientRect().height;
    const listItemHeight = scrollToTarget.getBoundingClientRect().height;

    const finalOffset = itemTopOffset - listHeight / 2 + listItemHeight / 2;
    this.scrollTo(list, finalOffset, 1000);
    this.sleep(1000).then(() => {
      this.stepExecutionFinished();
    });
  }

  private scrollToSide(list: HTMLElement, side: ScrollToSide) {
    // TODO: - Add all sides support later
    const listHeight = list.getBoundingClientRect().height;
    this.scrollTo(list, listHeight, 1000);
    this.sleep(1000).then(() => {
      this.stepExecutionFinished();
    });
  }

  private simulatePerformHandlerEvent(event: PerformHandlerAutomatedEvent) {
    event.handler();
    this.stepExecutionFinished();
  }

  // Helpers

  private scrollTo(element: any, to: any, duration: number) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        this.sleep(increment).then(() => {
          animateScroll();
        });
      }
    };
    animateScroll();
  }

  private async simulateFocusEvent(event: TypingAutomatedEvent) {
    const target = getElementBySelector(event.target);
    if (!target) {
      return new Promise((resolve) => resolve());
    }

    return this.simulateHoverEvent(target)
      .then(() => this.sleep(500))
      .then(() => {
        this.setState({isClickVisible: true});
        target.focus();
        return this.sleep(500);
      })
      .then(() => {
        this.setState({isClickVisible: false});
        this.removeHoverEvent(target);
        return this.sleep(500);
      });
  }

  private stepExecutionFinished() {
    const {onAutomationFinished, automatedSteps} = this.props;
    const {currentIdx} = this.state;

    const currentStep = automatedSteps[currentIdx];
    const nextDelay = currentStep.waitAfter !== undefined ? currentStep.waitAfter : 1800;

    const nextIdx = currentIdx + 1;
    const hasNext = nextIdx < automatedSteps.length;

    if (hasNext) {
      this.sleep(nextDelay).then(() => {
        this.setState({currentIdx: nextIdx});
      });
    } else {
      this.clearTimeouts();
      onAutomationFinished();
    }
  }

  private toggleCursor(isVisible: boolean) {
    this.setState({isCursorVisible: isVisible});
  }

  private handleNext() {
    const {automatedSteps} = this.props;
    const {currentIdx} = this.state;
    const currentStep = automatedSteps[currentIdx];
    this.executeEvent(currentStep);
  }

  // Timeouts

  private sleep(time: number) {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, time);
      this.timeouts.push(timer);
    });
  }

  private clearTimeouts() {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
  }
}

/* Compose
-------------------------------------------------------------------------*/

export const AutomatedGuide: React.ComponentClass<IOuterProps> = compose<ITemplateProps, IOuterProps>(
  setDisplayName("AutomatedGuide"),
  withConnect,
)(Template);
