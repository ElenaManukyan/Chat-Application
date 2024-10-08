import React, { useEffect, useState, useRef } from 'react';  
import { Toast } from 'react-bootstrap';  
import { CheckCircle } from 'react-bootstrap-icons';  

const ChannelCreationNotification = ({ show, onClose }) => {  
  const [isHovered, setIsHovered] = useState(false);  
  const [progress, setProgress] = useState(0);  
  const duration = 3000;   
  const intervalRef = useRef(null);  
  const timeoutRef = useRef(null);  

  useEffect(() => {  
    if (show) {  
      setProgress(0);   

      intervalRef.current = setInterval(() => {  
        if (!isHovered) {  
          setProgress((prev) => {  
            if (prev >= 100) {  
              clearInterval(intervalRef.current);  
              onClose(); 
              return 100;  
            }  
            return prev + (100 / (duration / 100));  
          });  
        }  
      }, 100);  

      return () => {  
        clearInterval(intervalRef.current);   
        clearTimeout(timeoutRef.current);  
      };  
    }  
  }, [show, isHovered, onClose]);   

  
  useEffect(() => {  
    if (progress >= 100) {  
      clearTimeout(timeoutRef.current);
      onClose();  
    }  
  }, [progress, onClose]);


  return (  
    <div  
      aria-live="polite"  
      aria-atomic="true"  
      style={{  
        position: 'fixed',  
        top: 20,  
        right: 20,  
        zIndex: 1050,  
      }}  
    >  
      <Toast  
        onClose={onClose}  
        show={show}   
        style={{ width: '300px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}   
        onMouseEnter={() => {  
          setIsHovered(true);  
          
          clearTimeout(timeoutRef.current);  
        }}  
        onMouseLeave={() => {  
          setIsHovered(false);  
          if (progress < 100) {
            timeoutRef.current = setTimeout(() => {
              onClose();
            }, duration - (progress * duration) / 100); 
          } 
        }}  
      >   
        <Toast.Header>  
          <CheckCircle style={{ marginRight: '10px' }} />  
          <strong className="me-auto">Канал создан!</strong>  
        </Toast.Header>  
        <Toast.Body style={{ paddingBottom: '10px' }}>  
          <div  
            style={{  
              height: '4px',  
              backgroundColor: 'green',  
              width: `${progress}%`,   
              transition: 'width 0.1s',  
              position: 'absolute',   
              bottom: 0,   
              left: 0,  
              borderRadius: '8px',  
            }}  
          />  
        </Toast.Body>  
      </Toast>  
    </div>  
  );  
};  

export default ChannelCreationNotification;





