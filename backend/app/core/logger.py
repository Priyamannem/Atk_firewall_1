import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logger(name: str):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    logHandler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(message)s %(filename)s %(lineno)d'
    )
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)
    return logger

logger = setup_logger("firewall_backend")
