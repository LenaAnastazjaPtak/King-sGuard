<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240826100037 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE credentials DROP FOREIGN KEY FK_FA05280E12469DE2');
        $this->addSql('ALTER TABLE credentials ADD CONSTRAINT FK_FA05280E12469DE2 FOREIGN KEY (category_id) REFERENCES `group` (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE credentials DROP FOREIGN KEY FK_FA05280E12469DE2');
        $this->addSql('ALTER TABLE credentials ADD CONSTRAINT FK_FA05280E12469DE2 FOREIGN KEY (category_id) REFERENCES `group` (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
