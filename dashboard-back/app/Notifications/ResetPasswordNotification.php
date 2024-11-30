<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class ResetPasswordNotification extends Notification
{
    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Définir les canaux de notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Construire le message de la notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
    
        $url = 'http://localhost:5173/reset-password?token='.$this->token;
        return (new MailMessage)
                    ->subject('Réinitialisation de votre mot de passe')
                    ->line('Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe.')
                    ->action('Réinitialiser le mot de passe', $url)
                    ->line('Si vous n\'avez pas demandé cette réinitialisation, ignorez cet email.');
    }
}
