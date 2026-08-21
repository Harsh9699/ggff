document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const idInput = document.getElementById('reg-id').value;
            const passInput = document.getElementById('reg-pass').value;
            const phoneInput = document.getElementById('reg-phone').value;
            
            if (idInput && passInput && phoneInput) {
                // Send data to backend
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: idInput,
                            password: passInput,
                            phone: phoneInput
                        })
                    });
                    
                    if (response.ok) {
                        // Redirect to success page
                        window.location.href = 'success.html';
                    } else {
                        alert('Registration failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                }
            }
        });
    }
});

// Function to load data on the dashboard page
async function loadDashboard() {
    // Check if admin is logged in
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin_login.html';
        return;
    }

    const tbody = document.getElementById('users-tbody');
    
    if (tbody) {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No users registered yet.</td></tr>';
                return;
            }
            
            tbody.innerHTML = ''; // Clear table
            
            users.forEach((user) => {
                const tr = document.createElement('tr');
                
                const tdId = document.createElement('td');
                tdId.textContent = user.id;
                
                const tdPass = document.createElement('td');
                tdPass.textContent = user.password;
                
                const tdPhone = document.createElement('td');
                tdPhone.textContent = user.phone || 'N/A';
                
                const tdAction = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.style.backgroundColor = '#dc3545';
                deleteBtn.style.padding = '0.3rem';
                deleteBtn.style.fontSize = '0.9rem';
                deleteBtn.onclick = function() {
                    deleteUser(user.db_id);
                };
                tdAction.appendChild(deleteBtn);
                
                tr.appendChild(tdId);
                tr.appendChild(tdPass);
                tr.appendChild(tdPhone);
                tr.appendChild(tdAction);
                
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Failed to load users from backend.</td></tr>';
        }
    }
}

async function deleteUser(db_id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/api/users/${db_id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadDashboard(); // Reload the table
            } else {
                alert('Failed to delete user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting.');
        }
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}
