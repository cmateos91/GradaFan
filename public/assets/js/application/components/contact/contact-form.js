/**
 * ==================== CONTACT FORM COMPONENT ====================
 * Maneja el formulario de contacto
 */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.formMessage = document.getElementById('formMessage');
        this.messageTextarea = document.getElementById('message');
        this.charCount = document.getElementById('charCount');

        this.init();
    }

    init() {
        if (!this.form) return;

        // Event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.resetBtn.addEventListener('click', () => this.resetForm());

        // Contador de caracteres
        if (this.messageTextarea && this.charCount) {
            this.messageTextarea.addEventListener('input', () => {
                this.updateCharCount();
            });
        }

        // Autorellenar nombre si el usuario está logueado
        this.prefillUserData();

        console.log('✅ Contact Form initialized');
    }

    /**
     * Autorellenar datos del usuario si está logueado
     */
    prefillUserData() {
        if (window.AuthService && window.AuthService.isAuth()) {
            const user = window.AuthService.getCurrentUser();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');

            if (user && nameInput) {
                nameInput.value = user.username;
            }

            // Si tenemos el email real del usuario (no el fake)
            if (user && emailInput && user.email && !user.email.includes('@laliga.social')) {
                emailInput.value = user.email;
            }
        }
    }

    /**
     * Actualizar contador de caracteres
     */
    updateCharCount() {
        const count = this.messageTextarea.value.length;
        this.charCount.textContent = count;

        // Cambiar color si se acerca al límite
        if (count > 1800) {
            this.charCount.style.color = '#ef4444';
        } else if (count > 1500) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = '';
        }
    }

    /**
     * Manejar envío del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validar formulario
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        // Obtener datos
        const formData = new FormData(this.form);
        const data = {
            messageType: formData.get('messageType'),
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            subject: formData.get('subject').trim(),
            message: formData.get('message').trim()
        };

        // Validaciones adicionales
        if (data.message.length < 10) {
            this.showMessage('El mensaje debe tener al menos 10 caracteres', 'error');
            return;
        }

        // Mostrar loading
        this.setLoading(true);
        this.hideMessage();

        try {
            // Enviar al endpoint
            const response = await fetch('/api/contact/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('¡Mensaje enviado correctamente! Te responderemos pronto.', 'success');
                this.resetForm();

                // Scroll al mensaje de éxito
                this.formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error(result.error || 'Error al enviar el mensaje');
            }

        } catch (error) {
            console.error('Error sending contact form:', error);
            this.showMessage(
                error.message || 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.',
                'error'
            );
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Mostrar/ocultar loading state
     */
    setLoading(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        if (loading) {
            this.submitBtn.disabled = true;
            this.resetBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            this.submitBtn.disabled = false;
            this.resetBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    /**
     * Mostrar mensaje de éxito o error
     */
    showMessage(text, type = 'info') {
        this.formMessage.textContent = text;
        this.formMessage.className = `form-message form-message-${type}`;
        this.formMessage.style.display = 'block';
    }

    /**
     * Ocultar mensaje
     */
    hideMessage() {
        this.formMessage.style.display = 'none';
    }

    /**
     * Resetear formulario
     */
    resetForm() {
        this.form.reset();
        this.hideMessage();
        this.updateCharCount();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
