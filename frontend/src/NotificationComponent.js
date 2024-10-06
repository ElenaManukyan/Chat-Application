import React, { useEffect, useState, useRef } from 'react';  
import { Toast } from 'react-bootstrap';  
import { CheckCircle } from 'react-bootstrap-icons';  

const ChannelCreationNotification = ({ show, onClose }) => {  
  const [isHovered, setIsHovered] = useState(false);  
  const [progress, setProgress] = useState(0);  
  const duration = 3000;   
  const intervalRef = useRef(null);  
  const timeoutRef = useRef(null);
  // const [isFirstShow, setIsFirstShow] = useState(true);
  console.log(`show in ChannelCreationNotification= ${show}`);

  useEffect(() => {  
    if (show) {  
      //if (isFirstShow) {
        setProgress(0); // Сброс прогресса 
        //setIsFirstShow(false); 
      //}  

      
      intervalRef.current = setInterval(() => {  
        if (!isHovered) {  
          setProgress((prev) => {  
            if (prev >= 100) {  
              clearInterval(intervalRef.current);  
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
  }, [show, /*isHovered,*/ onClose]); 
  
  useEffect(() => {  
    if (show) {

      intervalRef.current = setInterval(() => {  
        if (!isHovered) {  
          setProgress((prev) => {  
            if (prev >= 100) {  
              clearInterval(intervalRef.current);  
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
  }, [isHovered]);

  useEffect(() => {
    if (progress >= 100) {
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
          // setProgress(progress);
          clearInterval(intervalRef.current); 
          clearTimeout(timeoutRef.current); 
        }}  
        onMouseLeave={() => {
          setIsHovered(false);
          
          timeoutRef.current = setTimeout(() => {
            onClose(); 
          }, duration - (progress * duration) / 100); 
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






