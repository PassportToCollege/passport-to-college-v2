import React from 'react';

interface InfoStripProps {
  content: string;
  children: React.ReactChildren;
  stripStyles: React.CSSProperties;
}

const InfoStrip = (props: InfoStripProps): React.ReactNode => {
  const { content, children, stripStyles } = props;
  const styles: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#FFCB61',
    color: 'white',
    fontSize: '2.175em',
    lineHeight: '1.175em',
    fontFamily: 'Muli, san-serif',
    padding: '3em',
    textAlign: 'center', 
    ...stripStyles
  };

  return (
    <div 
      className="info_strip" 
      style={styles}
    >
      {
        content 
          ? <p 
            style={{
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            {content}
          </p> 
          : null
      }
      {children}
    </div>
  );
};

export default InfoStrip;