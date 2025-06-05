// Documentation tabs
        const docTabs = document.querySelectorAll('.doc-tab');
        const docPanels = document.querySelectorAll('.doc-panel');
        const progressFill = document.querySelector('.doc-progress-fill');
        const progressText = document.querySelector('.doc-progress-text');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        // Nouvel ordre des onglets
        const tabOrder = ['security', 'architecture', 'implementation', 'compliance', 'monitoring'];
        let currentTabIndex = 0;
        
        function updateProgress() {
            const progress = ((currentTabIndex + 1) / tabOrder.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Étape ${currentTabIndex + 1} sur ${tabOrder.length}`;
        }
        
        function switchTab(tabName) {
            const index = tabOrder.indexOf(tabName);
            if (index !== -1) {
                currentTabIndex = index;
                
                docTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.dataset.tab === tabName) {
                        tab.classList.add('active');
                    }
                });
                
                docPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `${tabName}-panel`) {
                        panel.classList.add('active');
                    }
                });
                
                updateProgress();
                updateNavigationButtons();
            }
        }
        
        function updateNavigationButtons() {
            prevBtn.style.display = currentTabIndex === 0 ? 'none' : 'inline-block';
            nextBtn.style.display = currentTabIndex === tabOrder.length - 1 ? 'none' : 'inline-block';
        }
        
        docTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                switchTab(tabName);
            });
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentTabIndex > 0) {
                currentTabIndex--;
                const prevTabName = tabOrder[currentTabIndex];
                switchTab(prevTabName);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentTabIndex < tabOrder.length - 1) {
                currentTabIndex++;
                const nextTabName = tabOrder[currentTabIndex];
                switchTab(nextTabName);
            }
        });
        
        // Initialisation
        switchTab(tabOrder[currentTabIndex]);