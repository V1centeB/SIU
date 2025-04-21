document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.draggable-word');
    const dropZones = document.querySelectorAll('.drop-zone');
  
    words.forEach(word => {
      word.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', word.textContent);
        word.classList.add('dragging');
      });
  
      word.addEventListener('dragend', () => {
        word.classList.remove('dragging');
      });
    });
  
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('over');
      });
  
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('over');
      });
  
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('over');
  
        const droppedText = e.dataTransfer.getData('text/plain');
  
        // Si ya hay una palabra en el hueco, la devolvemos al banco
        const current = zone.querySelector('.draggable-word');
        if (current) {
          document.querySelector('.word-bank').appendChild(current);
        }
  
        // Buscar el elemento que estamos soltando
        const dragged = Array.from(document.querySelectorAll('.draggable-word'))
          .find(w => w.textContent === droppedText);
  
        if (dragged) {
          zone.appendChild(dragged);
        }
      });
    });
  
    // Permitir soltar en el banco de palabras
    const wordBank = document.querySelector('.word-bank');
    wordBank.addEventListener('dragover', e => e.preventDefault());
    wordBank.addEventListener('drop', e => {
      e.preventDefault();
      const droppedText = e.dataTransfer.getData('text/plain');
      const dragged = Array.from(document.querySelectorAll('.draggable-word'))
        .find(w => w.textContent === droppedText);
      if (dragged) {
        wordBank.appendChild(dragged);
      }
    });
  });

  
  document.getElementById('comprobar-btn').addEventListener('click', () => {
    const dropZones = document.querySelectorAll('.drop-zone');
    let total = dropZones.length;
    let correct = 0;
  
    dropZones.forEach(zone => {
      const expected = zone.getAttribute('data-translation');
      const word = zone.querySelector('.draggable-word');
  
      if (word && word.textContent.trim() === expected.trim()) {
        correct++;
        zone.style.border = '2px solid green';
      } else {
        zone.style.border = '2px solid red';
      }
    });
  
    const resultado = document.getElementById('resultado-check');
    if (correct === total) {
      resultado.textContent = '✅ ¡Todo correcto!';
      resultado.style.color = 'green';
    } else {
      resultado.textContent = `❌ ${correct} de ${total} correctos`;
      resultado.style.color = 'red';
    }
  
    // Limpiar bordes tras 2 segundos
    setTimeout(() => {
      dropZones.forEach(zone => {
        zone.style.border = '2px dashed #999';
      });
      resultado.textContent = '';
    }, 2000);
  });
    