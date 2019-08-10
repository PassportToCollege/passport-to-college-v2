import './TopicSection.css';

import React, { PureComponent } from 'react';

interface TopicSectionProps {
  heading: string;
  content: string;
  sectionStyles: React.CSSProperties;
}

export default class TopicSection extends PureComponent<TopicSectionProps>  {
  public render() {
    const { heading, content, sectionStyles } = this.props;

    return (
      <section className="topic_section" style={sectionStyles}>
        {
          heading ?
            <h5>{heading}</h5> : null
        }
        {content}
      </section>
    );
  }
}